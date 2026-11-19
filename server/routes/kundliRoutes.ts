import { Router, type Request, type Response } from "express";
import { z } from "zod";
import {
  calculateVedicKundliMatch,
  RASHI_DATA,
  NAKSHATRA_DATA,
  type AstrologicalProfile,
} from "../../shared/vedicAstrologyEngine";

export const kundliRouter = Router();

const profileSchema = z.object({
  name: z.string().min(1, "Name required"),
  gender: z.enum(["male", "female"]),
  birthDate: z.string().optional(),
  birthTime: z.string().optional(),
  birthPlace: z.string().optional(),
  rashi: z.string().min(1, "Rashi required"),
  nakshatra: z.string().min(1, "Nakshatra required"),
  charan: z.number().min(1).max(4).optional(),
  manglik: z.enum(["Non-manglik", "Manglik", "Anshik Manglik", "Don't know"]),
  gotra: z.string().optional(),
});

const calculateMatchSchema = z.object({
  groom: profileSchema,
  bride: profileSchema,
});

/**
 * 1. Calculate 36-Guna Kundli Match
 */
kundliRouter.post("/calculate", (req: Request, res: Response) => {
  try {
    const { groom, bride } = calculateMatchSchema.parse(req.body);
    const result = calculateVedicKundliMatch(
      groom as AstrologicalProfile,
      bride as AstrologicalProfile
    );

    res.json({
      success: true,
      result,
      message: "Vedic Kundli matching calculated successfully via in-house engine.",
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      error: err.errors ? err.errors[0]?.message : err.message || "Invalid astrological input",
    });
  }
});

/**
 * 2. Get Astrological Reference Data for Dropdowns
 */
kundliRouter.get("/reference-data", (_req: Request, res: Response) => {
  const rashis = Object.keys(RASHI_DATA).map((k) => ({
    name: k,
    english: RASHI_DATA[k].english,
    lord: RASHI_DATA[k].lord,
    element: RASHI_DATA[k].element,
  }));

  const nakshatras = Object.keys(NAKSHATRA_DATA).map((k) => ({
    name: k,
    gana: NAKSHATRA_DATA[k].gana,
    yoni: NAKSHATRA_DATA[k].yoni,
    nadi: NAKSHATRA_DATA[k].nadi,
  }));

  res.json({
    success: true,
    rashis,
    nakshatras,
    totalGunas: 36,
    engine: "Vivah Kar Lo In-House Vedic Astrology Engine v2.0",
  });
});

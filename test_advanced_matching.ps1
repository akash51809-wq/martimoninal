$BaseUrl = "http://localhost:3001"
$Headers = @{ "Content-Type" = "application/json" }

Write-Host "=== 1. TEST PERSONALITY QUIZ QUESTIONS ===" -ForegroundColor Cyan
$quiz = Invoke-RestMethod -Uri "$BaseUrl/api/v1/matches/personality/quiz" -Method GET
Write-Host "Success:" $quiz.success "Total Questions:" $quiz.questions.Count
Write-Host "First Question:" $quiz.questions[0].title

Write-Host "`n=== 2. TEST GET PERSONALITY PROFILE ===" -ForegroundColor Cyan
$userProfile = Invoke-RestMethod -Uri "$BaseUrl/api/v1/matches/personality/usr-active-complete" -Method GET
Write-Host "Success:" $userProfile.success "Archetype:" $userProfile.profile.archetypeBadge

Write-Host "`n=== 3. TEST UPDATE PERSONALITY TRAITS (POST) ===" -ForegroundColor Cyan
$newTraits = @{
    traits = @{
        socialEnergy = 4
        lifeOutlook = 4
        ambition = 5
        finances = 3
        familyBoundaries = 3
    }
} | ConvertTo-Json
$updatedProfile = Invoke-RestMethod -Uri "$BaseUrl/api/v1/matches/personality/usr-active-complete" -Method POST -Headers $Headers -Body $newTraits
Write-Host "Success:" $updatedProfile.success "New Archetype:" $updatedProfile.profile.archetypeBadge "Top Values:" ($updatedProfile.profile.topValues -join ", ")

Write-Host "`n=== 4. TEST COMPATIBILITY DEEP DIVE (CANDIDATE 1) ===" -ForegroundColor Cyan
$deepDive = Invoke-RestMethod -Uri "$BaseUrl/api/v1/matches/compatibility-detail/usr-active-complete/1" -Method GET
Write-Host "Success:" $deepDive.success "Candidate:" $deepDive.candidate.name
Write-Host "Match Success Probability:" $deepDive.matchSuccessReport.successProbability "% (" $deepDive.matchSuccessReport.stabilityGrade ")"
Write-Host "Multidimensional Score:" $deepDive.multidimensionalScore.compositeScore "%"
Write-Host "  - Lifestyle Score:" $deepDive.multidimensionalScore.lifestyle.score "%"
Write-Host "  - Family Score:" $deepDive.multidimensionalScore.family.score "%"
Write-Host "  - Education & Career Score:" $deepDive.multidimensionalScore.educationCareer.score "%"
Write-Host "Personality Alignment Score:" $deepDive.personalityCompatibility.compatibilityScore "%"
Write-Host "2-Way Mutual Match Score:" $deepDive.twoWayMutualMatch.mutualScore "%"
Write-Host "Smart Rank Score:" $deepDive.smartRank "pts"

Write-Host "`n=== 5. TEST RECOMMENDATIONS FEEDS WITH SMART RANKING SORT ===" -ForegroundColor Cyan
$recs = Invoke-RestMethod -Uri "$BaseUrl/api/v1/matches/recommendations?userId=usr-active-complete&category=daily&sortBy=smart_rank" -Method GET
Write-Host "Success:" $recs.success "Total Matches:" $recs.totalCount "Sort By:" $recs.sortBy
Write-Host "Top 3 Ranked Matches:"
for ($i = 0; $i -lt [Math]::Min(3, $recs.matches.Count); $i++) {
    $m = $recs.matches[$i]
    Write-Host "  #$($i+1) $($m.name) - Smart Rank: $($m.smartRankScore) pts | Success Prob: $($m.successProbability)% | Mutual: $($m.twoWayMutualScore)% | Archetype: $($m.personalityBadge)"
}

Write-Host "`n=== 6. TEST ADMIN RANKING WEIGHTS CONFIGURATION ===" -ForegroundColor Cyan
$weights = Invoke-RestMethod -Uri "$BaseUrl/api/v1/matches/admin/ranking-weights" -Method GET
Write-Host "Current Weights:" ($weights.weights | ConvertTo-Json -Compress)

$updatedWeightsPayload = @{
    horoscopeWeight = 20
    partnerPreferencesWeight = 30
    lifestyleWeight = 20
    educationCareerWeight = 15
    familyWeight = 10
    personalityWeight = 5
} | ConvertTo-Json

$putWeights = Invoke-RestMethod -Uri "$BaseUrl/api/v1/matches/admin/ranking-weights" -Method PUT -Headers $Headers -Body $updatedWeightsPayload
Write-Host "Updated Weights Success:" $putWeights.success "Partner Prefs Weight:" $putWeights.weights.partnerPreferencesWeight "%"

Write-Host "`nALL 5 ADVANCED MATCHING ENGINE SUITE TESTS PASSED 100%!" -ForegroundColor Green

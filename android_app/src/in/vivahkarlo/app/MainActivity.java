package in.vivahkarlo.app;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.ProgressBar;

public class MainActivity extends Activity {

    public static final String TARGET_URL = "https://vivah-karlo.onrender.com";
    public static final int FILE_CHOOSER_REQUEST_CODE = 1001;

    public WebView webView;
    public ProgressBar progressBar;
    public ValueCallback<Uri[]> filePathCallback;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        requestWindowFeature(Window.FEATURE_NO_TITLE);

        FrameLayout rootLayout = new FrameLayout(this);
        rootLayout.setLayoutParams(new ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT));

        webView = new WebView(this);
        webView.setLayoutParams(new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT));
        rootLayout.addView(webView);

        progressBar = new ProgressBar(this, null, android.R.attr.progressBarStyleHorizontal);
        FrameLayout.LayoutParams pbParams = new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                8);
        progressBar.setLayoutParams(pbParams);
        progressBar.setMax(100);
        progressBar.setVisibility(View.GONE);
        rootLayout.addView(progressBar);

        setContentView(rootLayout);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setLoadWithOverviewMode(true);
        settings.setUseWideViewPort(true);
        settings.setSupportZoom(true);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        settings.setMediaPlaybackRequiresUserGesture(false);

        String defaultUa = settings.getUserAgentString();
        settings.setUserAgentString(defaultUa + " VivahKarLoApp/1.0.0 (Android Native)");

        webView.setWebViewClient(new AppWebViewClient(this));
        webView.setWebChromeClient(new AppWebChromeClient(this));

        webView.loadUrl(TARGET_URL);
    }

    public static class AppWebViewClient extends WebViewClient {
        private final MainActivity activity;

        public AppWebViewClient(MainActivity activity) {
            this.activity = activity;
        }

        @Override
        public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
            String url = request.getUrl().toString();
            return handleUrl(url);
        }

        @Override
        public boolean shouldOverrideUrlLoading(WebView view, String url) {
            return handleUrl(url);
        }

        private boolean handleUrl(String url) {
            if (url == null) return false;

            if (url.startsWith("tel:")) {
                try {
                    Intent intent = new Intent(Intent.ACTION_DIAL, Uri.parse(url));
                    activity.startActivity(intent);
                    return true;
                } catch (Exception e) {
                    return false;
                }
            }

            if (url.startsWith("mailto:")) {
                try {
                    Intent intent = new Intent(Intent.ACTION_SENDTO, Uri.parse(url));
                    activity.startActivity(intent);
                    return true;
                } catch (Exception e) {
                    return false;
                }
            }

            if (url.startsWith("whatsapp:") || url.contains("wa.me") || url.contains("api.whatsapp.com")) {
                try {
                    Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                    activity.startActivity(intent);
                    return true;
                } catch (Exception e) {
                    return false;
                }
            }

            if (url.contains("vivah-karlo.onrender.com") || url.contains("localhost") || url.startsWith("/")) {
                return false;
            }

            try {
                Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                activity.startActivity(intent);
                return true;
            } catch (Exception e) {
                return false;
            }
        }

        @Override
        public void onPageStarted(WebView view, String url, Bitmap favicon) {
            super.onPageStarted(view, url, favicon);
            if (activity.progressBar != null) {
                activity.progressBar.setVisibility(View.VISIBLE);
            }
        }

        @Override
        public void onPageFinished(WebView view, String url) {
            super.onPageFinished(view, url);
            if (activity.progressBar != null) {
                activity.progressBar.setVisibility(View.GONE);
            }
        }

        @Override
        public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
            super.onReceivedError(view, request, error);
            if (activity.progressBar != null) {
                activity.progressBar.setVisibility(View.GONE);
            }
        }
    }

    public static class AppWebChromeClient extends WebChromeClient {
        private final MainActivity activity;

        public AppWebChromeClient(MainActivity activity) {
            this.activity = activity;
        }

        @Override
        public void onProgressChanged(WebView view, int newProgress) {
            if (activity.progressBar != null) {
                activity.progressBar.setProgress(newProgress);
                if (newProgress >= 100) {
                    activity.progressBar.setVisibility(View.GONE);
                }
            }
        }

        @Override
        public boolean onShowFileChooser(WebView webView, ValueCallback<Uri[]> filePathCallback,
                WebChromeClient.FileChooserParams fileChooserParams) {
            if (activity.filePathCallback != null) {
                activity.filePathCallback.onReceiveValue(null);
            }
            activity.filePathCallback = filePathCallback;

            Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
            intent.addCategory(Intent.CATEGORY_OPENABLE);
            intent.setType("image/*");

            try {
                activity.startActivityForResult(Intent.createChooser(intent, "Select Photo or Document"), FILE_CHOOSER_REQUEST_CODE);
                return true;
            } catch (Exception e) {
                activity.filePathCallback = null;
                return false;
            }
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == FILE_CHOOSER_REQUEST_CODE) {
            if (filePathCallback != null) {
                Uri[] results = null;
                if (resultCode == Activity.RESULT_OK && data != null) {
                    String dataString = data.getDataString();
                    if (dataString != null) {
                        results = new Uri[] { Uri.parse(dataString) };
                    }
                }
                filePathCallback.onReceiveValue(results);
                filePathCallback = null;
            }
        } else {
            super.onActivityResult(requestCode, resultCode, data);
        }
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK && webView != null && webView.canGoBack()) {
            webView.goBack();
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }

    @Override
    protected void onDestroy() {
        if (webView != null) {
            webView.destroy();
        }
        super.onDestroy();
    }
}

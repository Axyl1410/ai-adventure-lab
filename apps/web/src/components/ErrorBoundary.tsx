import { Component, type ErrorInfo, type ReactNode } from "react";
import { type WithTranslation, withTranslation } from "react-i18next";
import { BuddyBot } from "./BuddyBot";

interface Props extends WithTranslation {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  message: string;
}

class ErrorBoundaryInner extends Component<Props, State> {
  state: State = { hasError: false, message: "" };

  static getDerivedStateFromError(error: unknown): State {
    const message = error instanceof Error ? error.message : "unexpected error";
    return { hasError: true, message };
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, message: "" });
  };

  render() {
    const { t } = this.props;

    if (this.state.hasError) {
      const displayMessage =
        this.state.message === "unexpected error"
          ? t("error.unexpected")
          : this.state.message;

      return (
        <div className="flex flex-1 flex-col items-center justify-center gap-6 p-8 text-center">
          <BuddyBot size={120} state="warning" />
          <div className="space-y-2">
            <h2 className="font-black text-2xl text-ink">
              {this.props.fallbackTitle ?? t("error.title")}
            </h2>
            <p className="mx-auto max-w-sm font-bold text-muted text-sm">
              {t("error.body")}
            </p>
            {displayMessage && (
              <p className="mx-auto max-w-md break-all rounded-xl bg-cream px-3 py-2 font-mono text-muted/60 text-xs">
                {displayMessage}
              </p>
            )}
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              className="big-button bg-ink text-white"
              onClick={this.handleReset}
              type="button"
            >
              {t("error.retry")}
            </button>
            <a
              className="big-button border border-white/60 bg-white/90 text-ink"
              href="/"
            >
              {t("error.home")}
            </a>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export const ErrorBoundary = withTranslation()(ErrorBoundaryInner);

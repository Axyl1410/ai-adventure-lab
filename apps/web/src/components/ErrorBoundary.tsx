import { Component, type ErrorInfo, type ReactNode } from "react";
import { BuddyBot } from "./BuddyBot";

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: "" };

  static getDerivedStateFromError(error: unknown): State {
    const message =
      error instanceof Error ? error.message : "Đã xảy ra lỗi không mong muốn.";
    return { hasError: true, message };
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, message: "" });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-1 flex-col items-center justify-center gap-6 p-8 text-center">
          <BuddyBot size={120} state="warning" />
          <div className="space-y-2">
            <h2 className="font-black text-2xl text-ink">
              {this.props.fallbackTitle ?? "Ối! Có gì đó bị lỗi 🙈"}
            </h2>
            <p className="mx-auto max-w-sm font-bold text-muted text-sm">
              Buddy Bot bị vấp ngã. Em hãy thử tải lại trang hoặc quay về trang
              chủ nhé!
            </p>
            {this.state.message && (
              <p className="mx-auto max-w-md break-all rounded-xl bg-cream px-3 py-2 font-mono text-muted/60 text-xs">
                {this.state.message}
              </p>
            )}
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              className="big-button bg-ink text-white"
              onClick={this.handleReset}
              type="button"
            >
              🔄 Thử lại
            </button>
            <a
              className="big-button border border-white/60 bg-white/90 text-ink"
              href="/"
            >
              🏠 Về trang chủ
            </a>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

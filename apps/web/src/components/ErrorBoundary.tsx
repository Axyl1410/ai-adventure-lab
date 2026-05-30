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
          <BuddyBot state="warning" size={120} />
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-ink">
              {this.props.fallbackTitle ?? "Ối! Có gì đó bị lỗi 🙈"}
            </h2>
            <p className="text-sm font-bold text-muted max-w-sm mx-auto">
              Buddy Bot bị vấp ngã. Em hãy thử tải lại trang hoặc quay về trang chủ nhé!
            </p>
            {this.state.message && (
              <p className="text-xs text-muted/60 font-mono bg-cream rounded-xl px-3 py-2 max-w-md mx-auto break-all">
                {this.state.message}
              </p>
            )}
          </div>
          <div className="flex gap-3 flex-wrap justify-center">
            <button
              className="big-button bg-ink text-white"
              onClick={this.handleReset}
            >
              🔄 Thử lại
            </button>
            <a className="big-button bg-white/90 border border-white/60 text-ink" href="/">
              🏠 Về trang chủ
            </a>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

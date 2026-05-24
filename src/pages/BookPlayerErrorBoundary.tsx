import React from "react";

class BookPlayerErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: any }
> {
  state = { error: null };

  static getDerivedStateFromError(error: any) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{ color: "white", background: "black", minHeight: "100vh" }}
        >
          <h2>BookPlayer crashed</h2>
          <pre>{String(this.state.error?.message || this.state.error)}</pre>
        </div>
      );
    }

    return this.props.children;
  }
}

export default BookPlayerErrorBoundary;

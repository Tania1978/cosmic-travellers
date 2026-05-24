import React from "react";

type State = {
  error: any;
};

type Props = {
  children: React.ReactNode;
};

export class BookPlayerErrorBoundary extends React.Component<Props, State> {
  state: State = {
    error: null,
  };

  static getDerivedStateFromError(error: any) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            color: "white",
            background: "black",
            minHeight: "100vh",
            padding: 20,
          }}
        >
          <h2>BookPlayer crashed</h2>

          <pre>{String(this.state.error?.message || this.state.error)}</pre>
        </div>
      );
    }

    return this.props.children;
  }
}

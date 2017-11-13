import * as React from "react";
import { Container } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import { OverbounceCalculator } from "./OverbounceCalculator";

class App extends React.Component {
    render() {
        return (
            <Container>
                <OverbounceCalculator
                    {...this.getInitialValues()}
                    onChange={this.onChange}
                />
            </Container>
        );
    }

    private getInitialValues() {
        const initialNumberOfValues = parseInt(
            localStorage.getItem("numberOfValues") || "",
            10
        );
        const initialTargetHeight = parseInt(
            localStorage.getItem("targetHeight") || "",
            10
        );
        return {
            initialTargetHeight: isNaN(initialTargetHeight)
                ? undefined
                : initialTargetHeight,
            initialNumberOfValues: isNaN(initialNumberOfValues)
                ? undefined
                : initialNumberOfValues
        };
    }

    private onChange = (key: string, value: number) => {
        localStorage.setItem(key, value.toString());
    }
}

export default App;

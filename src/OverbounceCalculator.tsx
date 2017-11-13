import * as React from "react";
import { Direction, findOverbounceHeights, OverbounceType } from "./lib/etjump";
import {
    InputOnChangeData,
    Container,
    Form,
    Header,
    Grid,
    Input,
    Table
} from "semantic-ui-react";

export interface OverbounceCalculatorProps {
    readonly initialTargetHeight?: number;
    readonly initialNumberOfValues?: number;
    readonly onChange: (key: string, value: number) => void;
}
export interface OverbounceCalculatorState {
    readonly targetHeight: number;
    readonly numberOfValues: number;
    readonly isValid: boolean;
}

export class OverbounceCalculator extends React.Component<
    OverbounceCalculatorProps,
    OverbounceCalculatorState
> {
    // tslint:disable-next-line no-any
    constructor(props: OverbounceCalculatorProps, context: any) {
        super(props, context);

        this.state = {
            targetHeight: 128,
            numberOfValues: 10,
            isValid: true
        };
    }

    componentWillMount() {
        if (this.props.initialTargetHeight !== undefined) {
            this.setState(() => {
                return {
                    targetHeight: this.props.initialTargetHeight
                };
            });
        }
        if (this.props.initialNumberOfValues !== undefined) {
            this.setState(() => {
                return {
                    numberOfValues: this.props.initialNumberOfValues
                };
            });
        }
    }

    render() {
        return (
            <Container>
                <Header as="h1">Overbounce calculator</Header>
                <Form>
                    <Grid>
                        <Grid.Column width={8}>
                            <Form.Group widths="equal">
                                <Form.Field>
                                    <label>Target height</label>
                                    <Input
                                        value={this.state.targetHeight}
                                        onChange={this.onTargetHeightChange}
                                        type="number"
                                        step="10"
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>Number of values</label>
                                    <Input
                                        value={this.state.numberOfValues}
                                        onChange={this.onNumberOfValuesChange}
                                        type="number"
                                    />
                                </Form.Field>
                            </Form.Group>

                            <Header as="h2" />

                            <Form.Field>
                                <Table>
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell>
                                                Fall heights
                                            </Table.HeaderCell>
                                            <Table.HeaderCell>
                                                Jump heights
                                            </Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        {this.getClosestObHeights(
                                            this.state.targetHeight,
                                            this.state.numberOfValues
                                        ).map(h => {
                                            return (
                                                <Table.Row key={h.fall}>
                                                    <Table.Cell>
                                                        {h.fall}
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        {h.jump}
                                                    </Table.Cell>
                                                </Table.Row>
                                            );
                                        })}
                                    </Table.Body>
                                </Table>
                            </Form.Field>
                        </Grid.Column>
                    </Grid>
                </Form>
            </Container>
        );
    }

    private getClosestObHeights(
        target: number,
        num: number
    ): { fall: number; jump: number }[] {
        num = num > 0 ? num : 3;
        let fallHeights: number[] = [];
        let jumpHeights: number[] = [];

        fallHeights = fallHeights.concat(
            findOverbounceHeights(
                OverbounceType.Fall,
                target,
                Math.ceil(num / 2),
                Direction.Up
            )
        );
        // -1 to exclude target value
        fallHeights = fallHeights.concat(
            findOverbounceHeights(
                OverbounceType.Fall,
                target - 1,
                Math.floor(num / 2),
                Direction.Down
            )
        );
        fallHeights.sort((lhs, rhs) => (lhs < rhs ? -1 : 1));
        jumpHeights = jumpHeights.concat(
            findOverbounceHeights(
                OverbounceType.Jump,
                target,
                Math.ceil(num / 2),
                Direction.Up
            )
        );
        // -1 to exclude target value
        jumpHeights = jumpHeights.concat(
            findOverbounceHeights(
                OverbounceType.Jump,
                target - 1,
                Math.floor(num / 2),
                Direction.Down
            )
        );
        jumpHeights.sort((lhs, rhs) => (lhs < rhs ? -1 : 1));

        return fallHeights.map((h, idx) => {
            return {
                fall: h,
                jump: jumpHeights[idx]
            };
        });
    }

    private onTargetHeightChange = (
        e: React.SyntheticEvent<HTMLInputElement>,
        data: InputOnChangeData
    ) => {
        this.setState(() => {
            const parsed = parseInt(data.value, 10);
            if (!isNaN(parsed)) {
                this.props.onChange("targetHeight", parsed);
            }
            return {
                targetHeight: isNaN(parsed) ? data.value : parsed,
                isValid: !isNaN(parsed)
            };
        });
    }

    private onNumberOfValuesChange = (
        e: React.SyntheticEvent<HTMLInputElement>,
        data: InputOnChangeData
    ) => {
        this.setState(() => {
            const parsed = parseInt(data.value, 10);
            if (!isNaN(parsed)) {
                this.props.onChange("numberOfValues", parsed);
            }
            return {
                numberOfValues: isNaN(parsed) ? data.value : parsed,
                isValid: !isNaN(parsed)
            };
        });
    }
}

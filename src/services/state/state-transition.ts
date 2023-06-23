
export class StateTransition {
    protected fromName: string;
    protected toName: string;
    protected count: number;

    constructor(from: string, to: string) {
        this.fromName = from;
        this.toName = to;
    }

    public get from(): string {
        return this.fromName;
    }

    public get to(): string {
        return this.toName;
    }
}
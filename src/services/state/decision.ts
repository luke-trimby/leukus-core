
export class Decision {
    protected decisionName: string;
    protected nextName: string;

    constructor(name: string, nextName?: string) {
        this.decisionName = name;
        this.nextName = nextName;
    }

    public get name(): string {
        return this.decisionName;
    }

    public evaluate(): string {
        return this.nextName;
    }
}
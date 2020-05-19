export class Item {
    name: string;
    productNum: string;
    quantity: number;
    cost: number;
    project: string;

    constructor(name: string, productNum: string, cost: number, project: string) {
        this.name = name;
        this.productNum = productNum;
        this.cost = cost;
        this.project = project;
    }

    public getTotalCost(): Number {
        return (this.cost * this.quantity);
    }
}
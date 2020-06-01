export class Item {
    name: string;
    productNum: string;
    quantity: number;
    cost: number;
    project: string;

    constructor(name: string, productNum: string, cost: number, quantity: number, project: string) {
        this.name = name;
        this.productNum = productNum;
        this.cost = cost;
        this.project = project;
        this.quantity = quantity;
    }

    public getTotalCost(): Number {
        return (this.cost * this.quantity);
    }
}
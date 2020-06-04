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

    public getTotalCost() {
        return (this.cost * this.quantity);
    }

    public static calculateTotalCostOfItems(items: Item[]): number {
        let sum: number = 0;
        items.forEach((item) => sum += (item.cost * item.quantity));
        return sum;
    }

    public static getListOfNames(items: Item[]): string[] {
        let list: string[] = [];
        items.forEach((item) => list.push(item.name));
        return list
    } 
}
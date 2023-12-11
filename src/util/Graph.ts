export class GraphNode<T> {
    data: T;
    adjacent: GraphNode<T>[];
    comparator: (a: T, b: T) => number;

    constructor(data: T, comparator: (a: T, b: T) => number) {
        this.data = data;
        this.comparator = comparator;
        this.adjacent = [];
    }

    addAdjacent(node: GraphNode<T>): void {
        this.adjacent.push(node);
    }

    removeAdjacent(data: T): GraphNode<T> | undefined {
        const index = this.adjacent.findIndex((node) => this.comparator(node.data, data) === 0);

        if(index > -1) {
            return this.adjacent.splice(index, 1)[0];
        }

        return undefined;
    }
}

export class Graph<T> {
    nodes: Map<T, GraphNode<T>> = new Map();
    comparator: (a: T, b: T) => number;

    constructor(comparator: (a: T, b: T) => number) {
        this.comparator = comparator;
    }

    addNode(data: T): GraphNode<T> {
        let node = this.nodes.get(data);

        if(node) return node;

        node = new GraphNode(data, this.comparator);
        this.nodes.set(data, node);

        return node;
    }

    removeNode(data: T): GraphNode<T> | undefined {
        const nodeToRemove = this.nodes.get(data);

        if(!nodeToRemove) return undefined;

        this.nodes.forEach((node) => {
            node.removeAdjacent(nodeToRemove.data);
        });

        this.nodes.delete(data);

        return nodeToRemove;
    }

    addEdge(source: T, destination: T): void {
        const sourceNode = this.addNode(source);
        const destinationNode = this.addNode(destination);

        // Check if edge already exists
        if(sourceNode.adjacent.find(node => this.comparator(node.data, destination) === 0)) return;

        sourceNode.addAdjacent(destinationNode);
    }

    removeOneWayEdges(): void {
        this.nodes.forEach((node) => {
            node.adjacent = node.adjacent.filter((adjacentNode) => {
                // Check if the adjacent node has the current node as one of its adjacents
                const hasBidirectionalEdge = adjacentNode.adjacent.includes(node);
                return hasBidirectionalEdge;
            });
        });
    }
}

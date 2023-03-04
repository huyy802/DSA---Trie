const DATASET = [
  "macaco",
  "macaroni",
  "macaroon",
  "machinable",
  "machine",
  "macromolecular",
  "macroscopic",
  "macronuclear",
  "macro",
];

interface Link {
  [key: string]: TrieNode;
}

class TrieNode {
  value: string;
  is_ended: boolean;
  children: Link;
  constructor(val: string, is_ended: boolean) {
    this.value = val;
    this.is_ended = is_ended;
    this.children = {};
  }
}

class Trie {
  root: TrieNode;

  constructor(rootVal: string = "") {
    this.root = new TrieNode(rootVal, false);
  }

  insert(str: string) {
    /**
     * Todos:
     * 1. Check letter existing
     * 2. Check overlapping
     * 3. Add current letter to Trie unless overlapping
     */
    let currentNode = this.root;
    for (let i = 0; i < str.length; i++) {
      if (str[i] in currentNode.children) {
        //letter exists in node's children list
        currentNode = currentNode.children[str[i]];
        if (i === str.length - 1) {
          currentNode.is_ended = true;
        }
      } else {
        let newNode;
        if (i != str.length - 1) {
          newNode = new TrieNode(str[i], false);
        } else {
          newNode = new TrieNode(str[i], true);
        }
        currentNode.children[str[i]] = newNode;
        currentNode = newNode;
      }
    }
  }

  findLastNode(str: string): TrieNode | null {
    let currentNode = this.root;
    for (let i = 0; i < str.length; i++) {
      const ch = str[i];
      if (ch in currentNode.children) {
        currentNode = currentNode.children[ch];
      } else {
        return null;
      }
    }
    return currentNode;
  }

  isExisted(str: string): boolean {
    let i = 0;
    let currentNode = this.root;
    while (i < str.length) {
      if (!(str[i] in currentNode.children)) {
        return false;
      } else {
        currentNode = currentNode.children[str[i]];
      }
      if (i === str.length - 1 && currentNode.is_ended === false) {
        return false;
      }
      i++;
    }
    return true;
  }

  delete(str: string) {
    function rec(node: TrieNode, i: number): boolean {
      if (i === str.length) {
        node.is_ended = false;
        return Object.keys(node.children).length === 0;
      }
      const next_deletion = rec(node.children[str[i]], i + 1);
      if (next_deletion === true) {
        delete node.children[str[i]];
      }
      return next_deletion && !node.is_ended;
    }

    if (this.isExisted(str)) {
      rec(this.root, 0);
    }
    return false;
  }

  printAll(node: TrieNode): string[] {
    /**
     * Depth-first search
     */
    function dfs(node: TrieNode, str: string, allStr: string[]) {
      str = str + node.value;
      if (node.is_ended === true) {
        allStr.push(str);
      }

      for (const k in node.children) {
        const child = node.children[k];
        dfs(child, str, allStr);
      }
    }
    const result: string[] = [];
    dfs(node, "", result);
    return result;
  }

  findPostfixes(str: string): string[] {
    /**
     * Auto-completion
     * prefix -> lists of postfixes
     *
     * Todos:
     * 1. Find the next node of the prefix string
     * 2. printAll the trie from the node
     */

    const lastNode = this.findLastNode(str);
    let result: string[] = [];
    if (lastNode !== null) {
      for (let k in lastNode.children) {
        const child = lastNode.children[k];
        const postfix = this.printAll(child);
        result = result.concat(postfix);
      }
    }
    return result;
  }
}

const t = new Trie();

DATASET.map((str) => {
  t.insert(str);
});

console.log("Before:");
console.log(t.printAll(t.root));

const str = "macronuclear";
console.log(`Does ${str} exist in Trie?: ${t.isExisted(str)}`);

const prefix = "macro";
console.log(`Postfixes of ${prefix}: `, t.findPostfixes(prefix));

console.log(`\nAfter:\nDelete ${str}:`);
t.delete(str);
console.log(t.printAll(t.root));

console.log(`Postfixes of ${prefix}: `, t.findPostfixes(prefix));

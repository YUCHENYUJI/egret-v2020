/**https://leetcode-cn.com/problems/add-two-numbers/
 * 2. 两数相加
给出两个 非空 的链表用来表示两个非负的整数。其中，它们各自的位数是按照 逆序 的方式存储的，并且它们的每个节点只能存储 一位 数字。

如果，我们将这两个数相加起来，则会返回一个新的链表来表示它们的和。

您可以假设除了数字 0 之外，这两个数都不会以 0 开头。

示例：

输入：(2 -> 4 -> 3) + (5 -> 6 -> 4)
输出：7 -> 0 -> 8
原因：342 + 465 = 807
*/
class TT {
    constructor() {
        this.InitData();
    }
    private InitData(): void {
        let arr_1: number[] = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
        let arr_2: number[] = [5, 6, 4];
        let A_1: ListNode = this.SetListNode(arr_1);
        let A_2: ListNode = this.SetListNode(arr_2);
        console.log("两个链表", A_1, A_2);
        let result: number = this.addTwoNumbers(A_1, A_2);
        console.log("得出链表结果", result);
    }
    private SetListNode(arr: number[] | string[]): ListNode {
        let L_Node = new ListNode;
        let T_Node = new ListNode;
        for (let i = 0; i < arr.length; i++) {
            if (i) {
                L_Node = new ListNode(Number(arr[i]), T_Node);
                T_Node = L_Node;
            } else {
                T_Node = new ListNode(Number(arr[i]));
            }
        }
        if (!L_Node.next) { return T_Node; } else {
            return L_Node;
        }

    }
    private addTwoNumbers(L_1: ListNode | null, L_2: ListNode | null): ListNode | any {
        let Value_A: number = this.GetListNodeLength(L_1);
        let Value_B: number = this.GetListNodeLength(L_2);
        let Arr: string[] = (Value_A + Value_B).toString().split("");
        return this.SetListNode(Arr);
    };
    private GetListNodeLength(L: ListNode): number {
        let Count: number = 0;
        let len: number = 0;
        while (L != null) {
            Count = Count + L.val * Math.pow(10, len);
            len++;
            L = L.next;
        }
        console.log("Count", Count);
        return Count;
    }
}

class ListNode {
    val: number
    next: ListNode | null
    constructor(val?: number, next?: ListNode | null) {
        this.val = (val === undefined ? 0 : val)
        this.next = (next === undefined ? null : next)
    }
}

// 假设有打乱顺序的一群人站成一个队列。 每个人由一个整数对(h, k)表示，其中h是这个人的身高，k是排在这个人前面且身高大于或等于h的人数。 编写一个算法来重建这个队列。

// 注意：
// 总人数少于1100人。

// 示例

// 输入:
// [[7,0], [4,4], [7,1], [5,0], [6,1], [5,2]]

// 输出:
// [[5,0], [7,0], [5,2], [6,1], [4,4], [7,1]]

// 来源：力扣（LeetCode）
// 链接：https://leetcode-cn.com/problems/queue-reconstruction-by-height
// 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
class test_ex {
    public constructor() {
        let nn: number[][] = [[7, 0], [4, 4], [7, 1], [5, 0], [6, 1], [5, 2]];
        console.log("测试输出", this.reconstructQueue(nn));
    }
    private reconstructQueue(people: number[][]): number[][] {
        //   Array<number[]>(people.length)
        people.sort(function compare(person1: number[], person2: number[]) {
            if (person1[0] != person2[0]) {
                return person1[0] - person2[0];
            } else {
                return person2[1] - person1[1];
            }
        }
        );
        let n = people.length;
        let ans: number[][] = new Array<number[]>(n);
        for (let k = 0; k < n; k++) {
            let spaces = people[k][1] + 1;
            for (let i = 0; i < n; i++) {
                if (ans[i] == null) {
                    spaces--;
                    if (spaces == 0) {
                        ans[i] = people[k];
                        break;
                    }
                }
            }
        }
        return ans;
    }
}
class HalfGet {
    private HalfGetNum(nums1: number[], nums2: number[]): number {
        var L_mid: number = Math.floor(nums1.length / 2);
        var R_mid: number = Math.floor(nums2.length / 2);
        var Mid: number = (nums1.length + nums2.length) % 2 ? (nums1.length + nums2.length) / 2 : 1 + (nums1.length + nums2.length) / 2;
        while (true) {
            if (nums1[L_mid] < nums2[R_mid]) {

            }
        }
        function fn() {

        }
    }
    private tt(): void {
        let t: string = "sxcasfsg";
        t[0];
        t[t.length - 1];
        t = `jio
        sdfsa
        dsfsaf
        adsaxcz
        sfa`
        t.indexOf('fs')
        t.slice(0, t.length - 1)
        console.log()
        var struct = {
            a: "ss",
            b: 2,
            c: 'a'
        }
        delete struct["a"]


        for (var key in struct) {

        }
        var a = [1, 2, 3];
        for (var x of a) {
            x
        }
        a.forEach(this.aa)
        do {

        } while (0);
    }
    private aa(element, index, array) {
        // element: 指向当前元素的值
        // index: 指向当前索引
        // array: 指向Array对象本身
        console.log(element + ', index = ' + index + "Array对象" + array);
    }
}
interface Map<K, V> {
    //清空
    clear(): void;
    //删除：通过key来删除value
    delete(key: K): boolean;
    //遍历
    forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any): void;
    //通过key获得value
    get(key: K): V | undefined;
    //判断是否存在对应的key值
    has(key: K): boolean;
    set(key: K, value: V): this;
    //获取map长度
    readonly size: number;
}
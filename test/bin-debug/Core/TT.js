var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
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
var TT = (function () {
    function TT() {
        this.InitData();
    }
    TT.prototype.InitData = function () {
        var arr_1 = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
        var arr_2 = [5, 6, 4];
        var A_1 = this.SetListNode(arr_1);
        var A_2 = this.SetListNode(arr_2);
        console.log("两个链表", A_1, A_2);
        var result = this.addTwoNumbers(A_1, A_2);
        console.log("得出链表结果", result);
    };
    TT.prototype.SetListNode = function (arr) {
        var L_Node = new ListNode;
        var T_Node = new ListNode;
        for (var i = 0; i < arr.length; i++) {
            if (i) {
                L_Node = new ListNode(Number(arr[i]), T_Node);
                T_Node = L_Node;
            }
            else {
                T_Node = new ListNode(Number(arr[i]));
            }
        }
        if (!L_Node.next) {
            return T_Node;
        }
        else {
            return L_Node;
        }
    };
    TT.prototype.addTwoNumbers = function (L_1, L_2) {
        var Value_A = this.GetListNodeLength(L_1);
        var Value_B = this.GetListNodeLength(L_2);
        var Arr = (Value_A + Value_B).toString().split("");
        return this.SetListNode(Arr);
    };
    ;
    TT.prototype.GetListNodeLength = function (L) {
        var Count = 0;
        var len = 0;
        while (L != null) {
            Count = Count + L.val * Math.pow(10, len);
            len++;
            L = L.next;
        }
        console.log("Count", Count);
        return Count;
    };
    return TT;
}());
__reflect(TT.prototype, "TT");
var ListNode = (function () {
    function ListNode(val, next) {
        this.val = (val === undefined ? 0 : val);
        this.next = (next === undefined ? null : next);
    }
    return ListNode;
}());
__reflect(ListNode.prototype, "ListNode");
//# sourceMappingURL=TT.js.map
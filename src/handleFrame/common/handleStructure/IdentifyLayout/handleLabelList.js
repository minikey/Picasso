const utils = require("./utils");

const markLabelList = (data = [], parent = "") => {
    // 标记lableList 的情况  距离左边的距离相等 只有一行的情况下
    try {
        for (let item of data) {
            if (
                utils.isEqualHeight(data) &&
                utils.isSameSpacing(data) &&
                (utils.hasBorder(data) || utils.hasBackground(data)) &&
                utils.hasTextType(data)
            ) {
                parent.isLabelList = true;
            }

            if (item.children && !item.isLabelList) {
                markLabelList(item.children, item);
            }
        }
        return data;
    } catch (error) {
        console.log(error);

    }
};

const mergeLabelList = data => {
    // 标记 isLabelList=true 合并的相邻行
    try {
        for (let i = 0; i < data.length; i++) {
            let prev = data[i];
            let next = i + 1 <= data.length ? data[i + 1] : null;
            if (next && prev.isLabelList && next.isLabelList) {
                // children 合并
                prev.children = [...prev.children, ...next.children];
                prev.marginBottom = next.y - prev.y - prev.height;
                prev.marginRight = prev.children[1].x - prev.children[0].x - prev.children[0].width;
                prev.height = next.y - prev.y + next.height
                data.splice(i + 1, 1); // 删除合并完之后的 next
                i--;
            }
            if (prev.children) {
                mergeLabelList(prev.children);
            }
        }
        return data;
    } catch (error) {
        console.log(error);
    }
};

const handleLabelList = data => {
    data = markLabelList(data);
    data = mergeLabelList(data);
    return data;
};

module.exports = handleLabelList;

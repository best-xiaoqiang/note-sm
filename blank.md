## call, apply, bind

### call

使用：

```javascript
// 1. 定义一个女孩叫x
var x = {
    // 她的身高是170
    height: 170,
    // 她有一双高跟鞋，作用是让她长高10厘米
    highShoes: function(){
        this.height += 10
    }
}
// x穿上高跟鞋
x.highShoes()
// 于是身高变成了180
console.log(x.height) // 180

// 2. 定义一个帅哥叫q
var q = {
    // 他的身高是160，...
    height: 160
}
// q也想增高一下
// q.highShoes() // 但是报错了：Uncaught TypeError: q.highShoes is not a function
// 因为q没有高跟鞋

// 3. q借用x的高跟鞋
x.highShoes.call(q)
// 我也长高啦！
console.log(q.height) // 170

// 这里的this就是指高跟鞋的拥有者，即x女孩
// 如果不通过call改变this的指向，这个高跟鞋的拥有者永远是x
// q通过call借来了x的高跟鞋
```

所以，call的作用就是：

~~高跟鞋搬运工~~

> 改变this的指向

apply， bind的作用同上。

### apply, bind

和call的区别：

```javascript

// 定义一个主人翁
var x = {}

// 定义一个化妆函数
function makeUp(color, style) {
    // 涂什么颜色的口红
    this.lips = color
    // 留什么样式的发型
    this.hair = style
}

// 用call：
makeUp.call(x, 'red', 'longHair')

// 用apply：
makeUp.apply(x, ['red', 'longHair'])

// 用bind：
makeUp.bind(x, 'red', 'longHair')()
```

第一个参数为null时：

```javascript
makeUp.call(null, 'yellow', 'shortHair')
// 非严格模式下，第一个参数是null，this指向的window
console.log(window.lips, window.hair) // "yellow", "shortHair"
```

### 自我实现

实现一个call函数：
```javascript
/*
*  call的工作原理，就是
*  将一个函数的this指向某个上下文，从而使这个上下文可以调用这个函数。
*  
*  函数就像某个工具，
*  工具无情，但工具认得this,
*  this就是它的主人翁。
*  
*  call就是把某个
*/ 
Function.prototype.lendMe = function (borrower) {
    var borrower = borrower || window
    borrower.tool = this
    var args = [...arguments].slice(1)
    var result = borrower.tool(...args)
    delete borrower.tool
    return result
}
```
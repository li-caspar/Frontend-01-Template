#### Expressions 表达式
##### 一、Member 访问成员变量
> a.b
> a[b]
> foot`string`
> super.b
> super['b']
> new.target
> new Foo()
##### 二、 New
> Example
> new a()()
> new new a()
##### 三 Reference
> Object
> Key
##### 四 Call 函数调用
>foo()
>super()
>foo()['b']
>foo().b
>foo()`b`
##### 五 Left Handside & Right Handside
>a.b = c
>a+b=c
##### 六 update
>a++
>a--
>--a
>++a
##### 七 Unary
> delete a.b
> void foo()
> typeof a
typeof null的结果是object，typeof function(){}的结果 是function
> +a
> -a
> ~a
> !a
> await a
##### 八 Exponental 乘方
> **
> 唯一个右结合的
##### 九
> Multiplicative  * / %
> Additive + -
> Shipt << >> >>>
> Relationship
> < > <= >= instanceof in
##### 十 比较运算符
> Equality
==  != === !==
Bitwise
& ^ |
##### 逻辑运算符
> Logical  可用于短路运算  比如 foo1() && foo2()  或  foo1() || foo2()
&& ||
> Conditional
? :

#### 类型转换
##### 一 装箱操作
> Boolean Number String  Symbol支持装箱操作
> 类和类型是二个不同的东西
> 上面的构造函数 不带new的操作都是直接创建对应类型的值
> 强制装箱的方法。比如Object("a")或 new Object("a")   或Object(1)
> Symbol不允许使用new 比如可以直接使用Object(Symbol("a"))来装箱
   Object.getPrototypeOf(Object(Symbol("1"))) === Symbol.prototype
   Object(Symbol("1")) instanceof Symbol
   也可以这样装箱  (function(){return this}).apply(Symbol("1"))
##### 二 拆箱操作
```
1 + {}
"1[object Object]"
1 + {valueOf(){return 2}}
3
1 + {toString(){return "2"}}
"12"
1 + {valueOf(){return 1},toString(){return "2"}}
2
"1" + {valueOf(){return 1},toString(){return "2"}}
"11"
```
```
1 + {[Symbol.toPrimitive](){return 6}, valueOf(){return 1},toString(){return "2"}}
7
"1" + {valueOf(){return},toString(){return "2"}}
"1undefined"
1 + {[Symbol.toPrimitive](){return {}}, valueOf(){return 1},toString(){return "2"}}
VM917:1 Uncaught TypeError: Cannot convert object to primitive value
    at <anonymous>:1:3
(anonymous) @ VM917:1
"1" + {valueOf(){return{}},toString(){return "2"}}
"12"

```

#### Javascripy中的对象
##### 一、基本对象
* Object
* Function
* Boolean
* Symbol
##### 二、错误对象
* Error

##### 三、数字日期对
* Number
* BigInt
* Math
* Date

###### 四、字符串对象

* String
##### 五 反射
* Reflect
* Proxy

##### js中特殊对象
* function
* Array
* String
* Arguments
* Object
* Number
* Math
* Date
* Json
* Boolean
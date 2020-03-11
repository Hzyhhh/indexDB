# 探索 indexDB--浏览器储存之对比**storage**和**indexDB**

In the project directory, you can run:

### `yarn start`

you can build:

### `yarn build`

---

## 背景

IndexedDB 是一种在用户浏览器中持久存储数据的方法。_它允许您不考虑网络可用性_，创建具有丰富查询能力的**可离线 Web 应用程序**。IndexedDB 对于**存储大量数据的应用程序**（例如借阅库中的 DVD 目录）和不需要持久 Internet 连接的应用程序（例如邮件客户端、待办事项列表或记事本）很有用。

---

## 是什么

> 使用 IndexedDB，你可以使用一个 key 作为索引进行存储或者获取数据。 你可以在事务(transaction)中完成对数据的修改。和大多数 web 存储解决方案相同，indexedDB 也遵从同源协议(same-origin policy). 所以你只能访问同域中存储的数据，而不能访问其他域的。

> IndexedDB 是一种异步(asynchronous) API，异步 API 适用于大多数情况，包括 Web Workers。因为在 Web Workers 上的使用，它过去也有一个同步(synchronous)的版本，但是因为缺少 web 社区的支持，它已经被从规范中移除了。

> IndexedDB 过去有一个竞争规范—— WebSQL 数据库，但是 W3C 组织在 2010 年 11 月 18 日废弃了 webSql。尽管两者都是存储的解决方案，但是他们提供的不是同样的功能。IndexedDB 和 WebSQL 的不同点在于 WebSQL 是关系型数据库访问系统，IndexedDB 是索引表系统(key-value 型)。

## 为什么

🆗

## 怎么用

在了解 indexDB 时,要注意三个对象,分别是 **IDBOpenDBRequest** **IDBDatabase** 和 **IDBObjectStore**

### api 介绍

[最全 api 文档介绍]('https://developer.mozilla.org/zh-CN/docs/Web/API/IndexedDB_API')

### 打开

```js
var request = window.indexedDB.open("MyTestDatabase");
```

兼容性写法

```js
window.indexDB =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB;

var request = window.indexDB.open("MyTestDatabase");
```

> 该 open 方法接受第二个参数，就是数据库的版本号。数据库的版本决定了数据库架构，即数据库的对象仓库（object store）和他的结构。如果数据库不存在，open 操作会创建该数据库，然后 onupgradeneeded 事件被触发，你需要在该事件的处理函数中创建数据库模式。如果数据库已经存在，但你指定了一个更高的数据库版本，会直接触发 onupgradeneeded 事件，允许你在处理函数中更新数据库模式。我们在后面的更新数据库的版本号和 IDBFactory.open 中会提到更多有关这方面的内容。

### 初始

> onupgradeneeded 是唯一可以更改数据库结构的地方。在其中，您可以创建和删除对象存储以及构建和删除索引。

初始的动作需要在 request.onupgradeneeded 内完成,该操作只会执行一次,类似与数据库的建表操作

该方法执行时会暴露 Event,该对象内 Event.target.result 属于 IDBDatabase 对象

IDBDatabase 对象可以由 onupgradeneeded 执行时暴露的 Event 获取 同时也可以 IDBOpenDBRequest.result 返回

Event.target.result 和 IDBOpenDBRequest.result 返回值都是 IDBDatabase 对象

### CURD

> 在使用新数据库执行任何操作之前，需要启动事务。事务来自数据库对象，您必须指定要跨事务的对象存储。一旦进入事务，就可以访问保存数据的对象存储并发出请求。接下来，您需要确定是要对数据库进行更改还是只需要读取数据库。交易有三种可用模式：readonly，readwrite，和 versionchange。

CURD 操作需要 IDBObjectStore 对象

该对象由 IDBDatabase 对象下的 transaction(事务).objectStore 函数返回

有该对象就能愉快的进行 CURD

### 迁移

## 兼容性

![caniuse](/caniuse.jpg)

## 总结

- IndexedDB 数据库使用 key-value 键值对储存数据
- IndexedDB 是事务模式的数据库
- The IndexedDB API 基本上是异步的
- <details>
  <summary>IndexedDB数据库“请求”无处不在</summary>

  > 我们上边提到，数据库“请求”负责接受成功或失败的 DOM 事件。每一个“请求”都包含 onsuccess 和 onerror 事件属性，同时你还对“事件”调用 addEventListener()和 removeEventListener()。“请求”还包括 readyState，result 和 errorCode 属性，用来表示“请求”的状态。result 属性尤其神奇，他可以根据“请求”生成的方式变成不同的东西，例如：IDBCursor 实例、刚插入数据库的数值对应的键值（key）等。

  </details>

* <details>
  <summary>IndexedDB在结果准备好之后通过DOM事件通知用户</summary>

  > DOM 事件总是有一个类型（type）属性（在 IndexedDB 中，该属性通常设置为 success 或 error）。DOM 事件还有一个目标（target）属性，用来告诉事件是被谁触发的。通常情况下，目标（target）属性是数据库操作生成的 IDBRequest。成功（success）事件不弹出提示并且不能撤销，错误（error）事件会弹出提示且可以撤销。这一点是非常重要的，因为除非错误事件被撤销，否则他们会终止所在的任何事务。

  </details>

* IndexedDB 是面向对象的
* indexedDB 不使用结构化查询语言(SQL)
* IndexedDB 遵循同源（same-origin）策略

## [**DEMO**](https://gitee.com/Hzyhhh/indexDB)

更多请参见:

[IndexedDB](https://developer.mozilla.org/zh-CN/docs/Web/API/IndexedDB_API)

[Storing images and files in IndexedDB](https://hacks.mozilla.org/2012/02/storing-images-and-files-in-indexeddb/)

[IndexedDB 中文教程](https://www.tangshuang.net/3735.html)

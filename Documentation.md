<a name="Cluster"></a>
## Cluster
**Kind**: global class  

* [Cluster](#Cluster)
  * [new Cluster()](#new_Cluster_new)
  * _instance_
    * [.load(driver, cb)](#Cluster+load)
    * [.unload(cb)](#Cluster+unload)
    * [.add(id, config, cb)](#Cluster+add)
    * [.remove(id, cb)](#Cluster+remove)
    * [.get(id, [selector], cb)](#Cluster+.get)
    * [.end(cb)](#Cluster+end)
    * [.escape(str)](#Cluster+escape) ⇒ <code>string</code>
    * [.escapeId(str)](#Cluster+escapeId) ⇒ <code>string</code>
    * [.format(sql, value)](#Cluster+format) ⇒ <code>string</code>
  * _inner_
    * [~loadCallack](#Cluster..loadCallack) : <code>function</code>
    * [~callback](#Cluster..callback) : <code>function</code>
    * [~getCallback](#Cluster..getCallback) : <code>function</code>

<a name="new_Cluster_new"></a>
### new Cluster()
pool cluster wrapper module for multiple hosts connection

<a name="Cluster+load"></a>
### cluster.load(driver, cb)
load driver

**Kind**: instance method of <code>[Cluster](#Cluster)</code>  

| Param | Type | Description |
| --- | --- | --- |
| driver | <code>string</code> | database driver |
| cb | <code>Cluster~loadCallback</code> | The callback that handle the results |

<a name="Cluster+unload"></a>
### cluster.unload(cb)
unload driver

**Kind**: instance method of <code>[Cluster](#Cluster)</code>  

| Param | Type | Description |
| --- | --- | --- |
| cb | <code>[callback](#Cluster..callback)</code> | The callback that handle the results |

<a name="Cluster+add"></a>
### cluster.add(id, config, cb)
add configuration

**Kind**: instance method of <code>[Cluster](#Cluster)</code>  
**See**: https://github.com/felixge/node-mysql/#connection-options  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | target group name |
| config | <code>object</code> | configuration |
| cb | <code>[callback](#Cluster..callback)</code> | The callback that handle the results. |

**Example**  
```js
cluster.add({ config })
cluster.add({ config }, cb)
cluster.add('slave', { config })
cluster.add('slave', { config }, cb)
```
<a name="Cluster+remove"></a>
### cluster.remove(id, cb)
remove configuration

**Kind**: instance method of <code>[Cluster](#Cluster)</code>  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | target group name |
| cb | <code>[callback](#Cluster..callback)</code> | The callback that handle the results. |

**Example**  
```js
cluster.remove('slave')
cluster.remove('slave*')
cluster.remove('slave*', cb)
```
<a name="Cluster+.get"></a>
### cluster.get(id, [selector], cb)
load connection

**Kind**: instance method of <code>[Cluster](#Cluster)</code>  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | target group name |
| [selector] | <code>string</code> | selector |
| cb | <code>[getCallback](#Cluster..getCallback)</code> | The callback that handle the results. |

**Example**  
```js
cluster.get(cb); // Target Group : ALL, Selector : RR (round-robin:default)
cluster.get('master', cb);	 // Target Group : 'master', Selector : RR
```
<a name="Cluster+end"></a>
### cluster.end(cb)
close all connections

**Kind**: instance method of <code>[Cluster](#Cluster)</code>  

| Param | Type | Description |
| --- | --- | --- |
| cb | <code>Cluster.prototype~callback</code> | The callback that handle the results. |

<a name="Cluster+escape"></a>
### cluster.escape(str) ⇒ <code>string</code>
escape string

**Kind**: instance method of <code>[Cluster](#Cluster)</code>  

| Param | Type |
| --- | --- |
| str | <code>string</code> | 

**Example**  
```js
cluster.escape('value')
// 'value'
```
<a name="Cluster+escapeId"></a>
### cluster.escapeId(str) ⇒ <code>string</code>
escape string by id

**Kind**: instance method of <code>[Cluster](#Cluster)</code>  

| Param | Type |
| --- | --- |
| str | <code>string</code> | 

**Example**  
```js
cluster.escapeId('table name')
// `table name`
```
<a name="Cluster+format"></a>
### cluster.format(sql, value) ⇒ <code>string</code>
prepare a query with mulitple insertion points,

**Kind**: instance method of <code>[Cluster](#Cluster)</code>  

| Param | Type |
| --- | --- |
| sql | <code>string</code> | 
| value | <code>array</code> | 

**Example**  
```js
var sql = "SELECT * FROM ?? WHERE ?? = ?"
var inserts = ['users', 'id', userId]
sql = cluster.format(sql, inserts)
```
<a name="Cluster..loadCallack"></a>
### Cluster~loadCallack : <code>function</code>
**Kind**: inner typedef of <code>[Cluster](#Cluster)</code>  

| Param | Type | Description |
| --- | --- | --- |
| err | <code>object</code> | error object |
| res | <code>string</code> | driver id |

<a name="Cluster..callback"></a>
### Cluster~callback : <code>function</code>
**Kind**: inner typedef of <code>[Cluster](#Cluster)</code>  

| Param | Type | Description |
| --- | --- | --- |
| err | <code>object</code> | error object |

<a name="Cluster..getCallback"></a>
### Cluster~getCallback : <code>function</code>
**Kind**: inner typedef of <code>[Cluster](#Cluster)</code>  

| Param | Type | Description |
| --- | --- | --- |
| err | <code>object</code> | error object |
| conn | <code>Connection</code> | instance of connection. |


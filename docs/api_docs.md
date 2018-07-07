## Classes

<dl>
<dt><a href="#Conversation">Conversation</a> ⇐ <code>EventEmitter</code></dt>
<dd><p>Create a new <code>Conversation</code>.
Inherits from EventEmitter.</p>
</dd>
<dt><a href="#Dialog">Dialog</a> ⇐ <code><a href="#new_ConversationManager_new">ConversationManager</a></code></dt>
<dd><p>Create a new <code>Dialog</code>.
Inherits from ConversationManager.</p>
</dd>
<dt><a href="#Dialog">Dialog</a></dt>
<dd></dd>
</dl>

<a name="Conversation"></a>

## Conversation ⇐ <code>EventEmitter</code>
Create a new `Conversation`.Inherits from EventEmitter.

**Kind**: global class  
**Extends**: <code>EventEmitter</code>  
**Access**: public  

* [Conversation](#Conversation) ⇐ <code>EventEmitter</code>
    * [new Conversation(robot, msg, receiverUserId, conversationName, schema, expireTime)](#new_Conversation_new)
    * [.addChoice(regex, handler)](#Conversation+addChoice)
    * [.updateAnswers(msg, value)](#Conversation+updateAnswers)
    * [.updateQuestion(question)](#Conversation+updateQuestion)

<a name="new_Conversation_new"></a>

### new Conversation(robot, msg, receiverUserId, conversationName, schema, expireTime)

| Param | Type | Description |
| --- | --- | --- |
| robot | <code>hubot.Robot</code> | instance of hubot's `Robot`. |
| msg | <code>Object</code> | the current response. |
| receiverUserId | <code>String</code> | `userId&roomId` or roomId. |
| conversationName | <code>String</code> | conversation name. |
| schema | <code>Object</code> | schema object. |
| expireTime | <code>number</code> | expire time. |

<a name="Conversation+addChoice"></a>

### conversation.addChoice(regex, handler)
Registers a new choice for current conversation.

**Kind**: instance method of [<code>Conversation</code>](#Conversation)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| regex | <code>Regex</code> | Expression to match. |
| handler | <code>function</code> | Handler function when matched. |

<a name="Conversation+updateAnswers"></a>

### conversation.updateAnswers(msg, value)
Update all answers.

**Kind**: instance method of [<code>Conversation</code>](#Conversation)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| msg | <code>Object</code> | the current response. |
| value | <code>String</code> | answer. |

<a name="Conversation+updateQuestion"></a>

### conversation.updateQuestion(question)
Update last question.

**Kind**: instance method of [<code>Conversation</code>](#Conversation)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| question | <code>String</code> | question. |

<a name="Dialog"></a>

## Dialog ⇐ [<code>ConversationManager</code>](#new_ConversationManager_new)
Create a new `Dialog`.Inherits from ConversationManager.

**Kind**: global class  
**Extends**: [<code>ConversationManager</code>](#new_ConversationManager_new)  
**Access**: public  

* [Dialog](#Dialog) ⇐ [<code>ConversationManager</code>](#new_ConversationManager_new)
    * [new Dialog#initSchema(name, schema)](#new_Dialog_new)
    * [.start(msg, conversationName, schema, expireTime)](#Dialog+start) ⇒ [<code>Conversation</code>](#Conversation)
    * [.resumeConversation(receiverUserId, conversationId)](#ConversationManager+resumeConversation) ⇒ <code>Object</code> \| [<code>Conversation</code>](#Conversation)
    * [.getConversations(receiverUserId)](#ConversationManager+getConversations) ⇒ [<code>Array.&lt;Conversation&gt;</code>](#Conversation)
    * [.getConversation(receiverUserId, conversationId)](#ConversationManager+getConversation) ⇒ [<code>Conversation</code>](#Conversation)
    * [.cancelConversation(receiverUserId, conversationId, options)](#ConversationManager+cancelConversation) ⇒ <code>Object</code> \| [<code>Conversation</code>](#Conversation)
    * [.cancelConversations(receiverUserId)](#ConversationManager+cancelConversations) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.getCurrentConversation(receiverUserId)](#ConversationManager+getCurrentConversation) ⇒ [<code>Conversation</code>](#Conversation) \| <code>Null</code>
    * [.existsConversation(msg)](#ConversationManager+existsConversation) ⇒ <code>Boolean</code>
    * [.getId(msg)](#ConversationManager+getId) ⇒ <code>String</code>

<a name="new_Dialog_new"></a>

### new Dialog#initSchema(name, schema)
**Returns**: [<code>ConversationSchema</code>](#new_ConversationSchema_new) - Returns a ConversationSchema instance.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | schema name. |
| schema | <code>Object</code> | schema object. |

<a name="Dialog+start"></a>

### dialog.start(msg, conversationName, schema, expireTime) ⇒ [<code>Conversation</code>](#Conversation)
Start a dialog.

**Kind**: instance method of [<code>Dialog</code>](#Dialog)  
**Returns**: [<code>Conversation</code>](#Conversation) - Returns a Conversation instance.  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| msg | <code>Object</code> | the current response. |
| conversationName | <code>String</code> | conversation name. |
| schema | <code>Object</code> | schema object. |
| expireTime | <code>Number</code> | expire time. |

<a name="ConversationManager+resumeConversation"></a>

### dialog.resumeConversation(receiverUserId, conversationId) ⇒ <code>Object</code> \| [<code>Conversation</code>](#Conversation)
Resume a conversation of `receiverUserId`.

**Kind**: instance method of [<code>Dialog</code>](#Dialog)  
**Returns**: <code>Object</code> \| [<code>Conversation</code>](#Conversation) - Returns result of the resume operation or the resumed conversation.  

| Param | Type | Description |
| --- | --- | --- |
| receiverUserId | <code>String</code> | `userId&roomId` or roomId. |
| conversationId | <code>String</code> | conversation id. |

<a name="ConversationManager+getConversations"></a>

### dialog.getConversations(receiverUserId) ⇒ [<code>Array.&lt;Conversation&gt;</code>](#Conversation)
Get all conversations of `receiverUserId`.

**Kind**: instance method of [<code>Dialog</code>](#Dialog)  
**Returns**: [<code>Array.&lt;Conversation&gt;</code>](#Conversation) - Returns all conversations of `receiverUserId`.  

| Param | Type | Description |
| --- | --- | --- |
| receiverUserId | <code>String</code> | `userId&roomId` or roomId. |

<a name="ConversationManager+getConversation"></a>

### dialog.getConversation(receiverUserId, conversationId) ⇒ [<code>Conversation</code>](#Conversation)
Get a conversation of `receiverUserId`.

**Kind**: instance method of [<code>Dialog</code>](#Dialog)  
**Returns**: [<code>Conversation</code>](#Conversation) - Returns the conversation.  

| Param | Type | Description |
| --- | --- | --- |
| receiverUserId | <code>String</code> | `userId&roomId` or roomId. |
| conversationId | <code>String</code> | conversation id. |

<a name="ConversationManager+cancelConversation"></a>

### dialog.cancelConversation(receiverUserId, conversationId, options) ⇒ <code>Object</code> \| [<code>Conversation</code>](#Conversation)
Cancel a conversation.If you canceled a active conversation, it will resume last pending conversation automatically.If there is no pending conversation, it will return a success result.Set options.single to be `false` will disable resume last pending conversation automatically.

**Kind**: instance method of [<code>Dialog</code>](#Dialog)  
**Returns**: <code>Object</code> \| [<code>Conversation</code>](#Conversation) - Returns result of the cancellation or the resumed conversation.  

| Param | Type | Description |
| --- | --- | --- |
| receiverUserId | <code>String</code> | `userId&roomId` or roomId. |
| conversationId | <code>String</code> | conversation id. |
| options | <code>Object</code> | default {single: true}, if resume last pending conversation automatically. |

<a name="ConversationManager+cancelConversations"></a>

### dialog.cancelConversations(receiverUserId) ⇒ <code>Array.&lt;Object&gt;</code>
Cancel all conversations of `receiverUserId`.

**Kind**: instance method of [<code>Dialog</code>](#Dialog)  
**Returns**: <code>Array.&lt;Object&gt;</code> - Returns all results of the cancellation.  

| Param | Type | Description |
| --- | --- | --- |
| receiverUserId | <code>String</code> | `userId&roomId` or roomId. |

<a name="ConversationManager+getCurrentConversation"></a>

### dialog.getCurrentConversation(receiverUserId) ⇒ [<code>Conversation</code>](#Conversation) \| <code>Null</code>
Get current active conversation of `receiverUserId`.

**Kind**: instance method of [<code>Dialog</code>](#Dialog)  
**Returns**: [<code>Conversation</code>](#Conversation) \| <code>Null</code> - Returns current conversation.  

| Param | Type | Description |
| --- | --- | --- |
| receiverUserId | <code>String</code> | `userId&roomId` or roomId. |

<a name="ConversationManager+existsConversation"></a>

### dialog.existsConversation(msg) ⇒ <code>Boolean</code>
Exists conversations.

**Kind**: instance method of [<code>Dialog</code>](#Dialog)  
**Returns**: <code>Boolean</code> - true or false.  

| Param | Type | Description |
| --- | --- | --- |
| msg | <code>Object</code> | the current context. |

<a name="ConversationManager+getId"></a>

### dialog.getId(msg) ⇒ <code>String</code>
Get `receiverUserId`.

**Kind**: instance method of [<code>Dialog</code>](#Dialog)  
**Returns**: <code>String</code> - receiverUserId - `userId&roomId` or roomId.  

| Param | Type | Description |
| --- | --- | --- |
| msg | <code>Object</code> | the current response. |

<a name="Dialog"></a>

## Dialog
**Kind**: global class  

* [Dialog](#Dialog)
    * [new Dialog#initSchema(name, schema)](#new_Dialog_new)
    * [.start(msg, conversationName, schema, expireTime)](#Dialog+start) ⇒ [<code>Conversation</code>](#Conversation)
    * [.resumeConversation(receiverUserId, conversationId)](#ConversationManager+resumeConversation) ⇒ <code>Object</code> \| [<code>Conversation</code>](#Conversation)
    * [.getConversations(receiverUserId)](#ConversationManager+getConversations) ⇒ [<code>Array.&lt;Conversation&gt;</code>](#Conversation)
    * [.getConversation(receiverUserId, conversationId)](#ConversationManager+getConversation) ⇒ [<code>Conversation</code>](#Conversation)
    * [.cancelConversation(receiverUserId, conversationId, options)](#ConversationManager+cancelConversation) ⇒ <code>Object</code> \| [<code>Conversation</code>](#Conversation)
    * [.cancelConversations(receiverUserId)](#ConversationManager+cancelConversations) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.getCurrentConversation(receiverUserId)](#ConversationManager+getCurrentConversation) ⇒ [<code>Conversation</code>](#Conversation) \| <code>Null</code>
    * [.existsConversation(msg)](#ConversationManager+existsConversation) ⇒ <code>Boolean</code>
    * [.getId(msg)](#ConversationManager+getId) ⇒ <code>String</code>

<a name="new_Dialog_new"></a>

### new Dialog#initSchema(name, schema)
**Returns**: [<code>ConversationSchema</code>](#new_ConversationSchema_new) - Returns a ConversationSchema instance.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | schema name. |
| schema | <code>Object</code> | schema object. |

<a name="Dialog+start"></a>

### dialog.start(msg, conversationName, schema, expireTime) ⇒ [<code>Conversation</code>](#Conversation)
Start a dialog.

**Kind**: instance method of [<code>Dialog</code>](#Dialog)  
**Returns**: [<code>Conversation</code>](#Conversation) - Returns a Conversation instance.  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| msg | <code>Object</code> | the current response. |
| conversationName | <code>String</code> | conversation name. |
| schema | <code>Object</code> | schema object. |
| expireTime | <code>Number</code> | expire time. |

<a name="ConversationManager+resumeConversation"></a>

### dialog.resumeConversation(receiverUserId, conversationId) ⇒ <code>Object</code> \| [<code>Conversation</code>](#Conversation)
Resume a conversation of `receiverUserId`.

**Kind**: instance method of [<code>Dialog</code>](#Dialog)  
**Returns**: <code>Object</code> \| [<code>Conversation</code>](#Conversation) - Returns result of the resume operation or the resumed conversation.  

| Param | Type | Description |
| --- | --- | --- |
| receiverUserId | <code>String</code> | `userId&roomId` or roomId. |
| conversationId | <code>String</code> | conversation id. |

<a name="ConversationManager+getConversations"></a>

### dialog.getConversations(receiverUserId) ⇒ [<code>Array.&lt;Conversation&gt;</code>](#Conversation)
Get all conversations of `receiverUserId`.

**Kind**: instance method of [<code>Dialog</code>](#Dialog)  
**Returns**: [<code>Array.&lt;Conversation&gt;</code>](#Conversation) - Returns all conversations of `receiverUserId`.  

| Param | Type | Description |
| --- | --- | --- |
| receiverUserId | <code>String</code> | `userId&roomId` or roomId. |

<a name="ConversationManager+getConversation"></a>

### dialog.getConversation(receiverUserId, conversationId) ⇒ [<code>Conversation</code>](#Conversation)
Get a conversation of `receiverUserId`.

**Kind**: instance method of [<code>Dialog</code>](#Dialog)  
**Returns**: [<code>Conversation</code>](#Conversation) - Returns the conversation.  

| Param | Type | Description |
| --- | --- | --- |
| receiverUserId | <code>String</code> | `userId&roomId` or roomId. |
| conversationId | <code>String</code> | conversation id. |

<a name="ConversationManager+cancelConversation"></a>

### dialog.cancelConversation(receiverUserId, conversationId, options) ⇒ <code>Object</code> \| [<code>Conversation</code>](#Conversation)
Cancel a conversation.If you canceled a active conversation, it will resume last pending conversation automatically.If there is no pending conversation, it will return a success result.Set options.single to be `false` will disable resume last pending conversation automatically.

**Kind**: instance method of [<code>Dialog</code>](#Dialog)  
**Returns**: <code>Object</code> \| [<code>Conversation</code>](#Conversation) - Returns result of the cancellation or the resumed conversation.  

| Param | Type | Description |
| --- | --- | --- |
| receiverUserId | <code>String</code> | `userId&roomId` or roomId. |
| conversationId | <code>String</code> | conversation id. |
| options | <code>Object</code> | default {single: true}, if resume last pending conversation automatically. |

<a name="ConversationManager+cancelConversations"></a>

### dialog.cancelConversations(receiverUserId) ⇒ <code>Array.&lt;Object&gt;</code>
Cancel all conversations of `receiverUserId`.

**Kind**: instance method of [<code>Dialog</code>](#Dialog)  
**Returns**: <code>Array.&lt;Object&gt;</code> - Returns all results of the cancellation.  

| Param | Type | Description |
| --- | --- | --- |
| receiverUserId | <code>String</code> | `userId&roomId` or roomId. |

<a name="ConversationManager+getCurrentConversation"></a>

### dialog.getCurrentConversation(receiverUserId) ⇒ [<code>Conversation</code>](#Conversation) \| <code>Null</code>
Get current active conversation of `receiverUserId`.

**Kind**: instance method of [<code>Dialog</code>](#Dialog)  
**Returns**: [<code>Conversation</code>](#Conversation) \| <code>Null</code> - Returns current conversation.  

| Param | Type | Description |
| --- | --- | --- |
| receiverUserId | <code>String</code> | `userId&roomId` or roomId. |

<a name="ConversationManager+existsConversation"></a>

### dialog.existsConversation(msg) ⇒ <code>Boolean</code>
Exists conversations.

**Kind**: instance method of [<code>Dialog</code>](#Dialog)  
**Returns**: <code>Boolean</code> - true or false.  

| Param | Type | Description |
| --- | --- | --- |
| msg | <code>Object</code> | the current context. |

<a name="ConversationManager+getId"></a>

### dialog.getId(msg) ⇒ <code>String</code>
Get `receiverUserId`.

**Kind**: instance method of [<code>Dialog</code>](#Dialog)  
**Returns**: <code>String</code> - receiverUserId - `userId&roomId` or roomId.  

| Param | Type | Description |
| --- | --- | --- |
| msg | <code>Object</code> | the current response. |


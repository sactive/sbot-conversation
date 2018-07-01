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
    * [.start(msg)](#Conversation+start)
    * [.resume()](#Conversation+resume)
    * [.pause()](#Conversation+pause)
    * [.receiveMessage(msg)](#Conversation+receiveMessage)
    * [.addChoice(regex, handler)](#Conversation+addChoice)
    * [.executeChoicesHandler(msg, text)](#Conversation+executeChoicesHandler)
    * [.updateAnswers(msg, value)](#Conversation+updateAnswers)
    * [.updateQuestion(question)](#Conversation+updateQuestion)

<a name="new_Conversation_new"></a>

### new Conversation(robot, msg, receiverUserId, conversationName, schema, expireTime)

| Param | Type | Description |
| --- | --- | --- |
| robot | <code>hubot.Robot</code> | instance of hubot's `Robot`. |
| msg | <code>Object</code> | the current response. |
| receiverUserId | <code>String</code> | `userId&roomId` or userId. |
| conversationName | <code>String</code> | conversation name. |
| schema | <code>Object</code> | schema object. |
| expireTime | <code>number</code> | expire time. |

<a name="Conversation+start"></a>

### conversation.start(msg)
tart a conversation.

**Kind**: instance method of [<code>Conversation</code>](#Conversation)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| msg | <code>Object</code> | the current response. |

<a name="Conversation+resume"></a>

### conversation.resume()
Resume conversation.

**Kind**: instance method of [<code>Conversation</code>](#Conversation)  
**Access**: public  
<a name="Conversation+pause"></a>

### conversation.pause()
Pause conversation.

**Kind**: instance method of [<code>Conversation</code>](#Conversation)  
**Access**: public  
<a name="Conversation+receiveMessage"></a>

### conversation.receiveMessage(msg)
Accepts an incoming message, tries to match against the registered choices.

**Kind**: instance method of [<code>Conversation</code>](#Conversation)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| msg | <code>Object</code> | the current response. |

<a name="Conversation+addChoice"></a>

### conversation.addChoice(regex, handler)
Registers a new choice for current conversation.

**Kind**: instance method of [<code>Conversation</code>](#Conversation)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| regex | <code>Regex</code> | Expression to match. |
| handler | <code>function</code> | Handler function when matched. |

<a name="Conversation+executeChoicesHandler"></a>

### conversation.executeChoicesHandler(msg, text)
Execute Choices Handler, after a choice is made, the timer is cleared.

**Kind**: instance method of [<code>Conversation</code>](#Conversation)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| msg | <code>Object</code> | the current response. |
| text | <code>String</code> | msg.message.text. |

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
    * [.addConversation(conversation)](#ConversationManager+addConversation) ⇒ [<code>Conversation</code>](#Conversation)
    * [.resumeConversation(receiverUserId, conversationId)](#ConversationManager+resumeConversation) ⇒ <code>String</code>
    * [.pauseConversation(receiverUserId, conversationId)](#ConversationManager+pauseConversation) ⇒ <code>String</code>
    * [.pauseConversations(receiverUserId)](#ConversationManager+pauseConversations) ⇒ <code>Array.&lt;String&gt;</code>
    * [.getConversations(receiverUserId)](#ConversationManager+getConversations) ⇒ [<code>Array.&lt;Conversation&gt;</code>](#Conversation)
    * [.getConversation(receiverUserId, conversationId)](#ConversationManager+getConversation) ⇒ [<code>Conversation</code>](#Conversation)
    * [.cancelConversation(receiverUserId, conversationId, options)](#ConversationManager+cancelConversation) ⇒ <code>String</code>
    * [.cancelConversations(receiverUserId)](#ConversationManager+cancelConversations) ⇒ <code>String</code>
    * [.getCurrentConversation(receiverUserId)](#ConversationManager+getCurrentConversation) ⇒ [<code>Conversation</code>](#Conversation) \| <code>Null</code>
    * [.existsConversation(msg)](#ConversationManager+existsConversation)

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

<a name="ConversationManager+addConversation"></a>

### dialog.addConversation(conversation) ⇒ [<code>Conversation</code>](#Conversation)
Create a new conversation.

**Kind**: instance method of [<code>Dialog</code>](#Dialog)  
**Returns**: [<code>Conversation</code>](#Conversation) - Returns current conversation instance.  

| Param | Type | Description |
| --- | --- | --- |
| conversation | [<code>Conversation</code>](#Conversation) | a new conversation. |

<a name="ConversationManager+resumeConversation"></a>

### dialog.resumeConversation(receiverUserId, conversationId) ⇒ <code>String</code>
Resume a conversation.

**Kind**: instance method of [<code>Dialog</code>](#Dialog)  
**Returns**: <code>String</code> - Returns resume conversation message.  

| Param | Type | Description |
| --- | --- | --- |
| receiverUserId | <code>String</code> | `userId&roomId` or userId. |
| conversationId | <code>String</code> | conversation id. |

<a name="ConversationManager+pauseConversation"></a>

### dialog.pauseConversation(receiverUserId, conversationId) ⇒ <code>String</code>
Pause a conversation.

**Kind**: instance method of [<code>Dialog</code>](#Dialog)  
**Returns**: <code>String</code> - Returns pause conversation message.  

| Param | Type | Description |
| --- | --- | --- |
| receiverUserId | <code>String</code> | `userId&roomId` or userId. |
| conversationId | <code>String</code> | conversation id. |

<a name="ConversationManager+pauseConversations"></a>

### dialog.pauseConversations(receiverUserId) ⇒ <code>Array.&lt;String&gt;</code>
Pause all conversations.

**Kind**: instance method of [<code>Dialog</code>](#Dialog)  
**Returns**: <code>Array.&lt;String&gt;</code> - Returns all paused conversations messages.  

| Param | Type | Description |
| --- | --- | --- |
| receiverUserId | <code>String</code> | `userId&roomId` or userId. |

<a name="ConversationManager+getConversations"></a>

### dialog.getConversations(receiverUserId) ⇒ [<code>Array.&lt;Conversation&gt;</code>](#Conversation)
Get all conversations.

**Kind**: instance method of [<code>Dialog</code>](#Dialog)  
**Returns**: [<code>Array.&lt;Conversation&gt;</code>](#Conversation) - Returns the conversations of `receiverUserId`.  

| Param | Type | Description |
| --- | --- | --- |
| receiverUserId | <code>String</code> | `userId&roomId` or userId. |

<a name="ConversationManager+getConversation"></a>

### dialog.getConversation(receiverUserId, conversationId) ⇒ [<code>Conversation</code>](#Conversation)
Get a conversation.

**Kind**: instance method of [<code>Dialog</code>](#Dialog)  
**Returns**: [<code>Conversation</code>](#Conversation) - Returns the conversation.  

| Param | Type | Description |
| --- | --- | --- |
| receiverUserId | <code>String</code> | `userId&roomId` or userId. |
| conversationId | <code>String</code> | conversation id. |

<a name="ConversationManager+cancelConversation"></a>

### dialog.cancelConversation(receiverUserId, conversationId, options) ⇒ <code>String</code>
Cancel a conversation.

**Kind**: instance method of [<code>Dialog</code>](#Dialog)  
**Returns**: <code>String</code> - Returns cancel conversation message.  

| Param | Type | Description |
| --- | --- | --- |
| receiverUserId | <code>String</code> | `userId&roomId` or roomId. |
| conversationId | <code>String</code> | conversation id. |
| options | <code>Object</code> | cancel single, e.g. {single: true}. |

<a name="ConversationManager+cancelConversations"></a>

### dialog.cancelConversations(receiverUserId) ⇒ <code>String</code>
Cancel all conversations.

**Kind**: instance method of [<code>Dialog</code>](#Dialog)  
**Returns**: <code>String</code> - Returns cancel all conversations message.  

| Param | Type | Description |
| --- | --- | --- |
| receiverUserId | <code>String</code> | `userId&roomId` or userId. |

<a name="ConversationManager+getCurrentConversation"></a>

### dialog.getCurrentConversation(receiverUserId) ⇒ [<code>Conversation</code>](#Conversation) \| <code>Null</code>
Get current active conversation.

**Kind**: instance method of [<code>Dialog</code>](#Dialog)  
**Returns**: [<code>Conversation</code>](#Conversation) \| <code>Null</code> - Returns current conversation.  

| Param | Type | Description |
| --- | --- | --- |
| receiverUserId | <code>String</code> | `userId&roomId` or userId. |

<a name="ConversationManager+existsConversation"></a>

### dialog.existsConversation(msg)
Exists conversations.

**Kind**: instance method of [<code>Dialog</code>](#Dialog)  

| Param | Type | Description |
| --- | --- | --- |
| msg | <code>Object</code> | the current context. |

<a name="Dialog"></a>

## Dialog
**Kind**: global class  

* [Dialog](#Dialog)
    * [new Dialog#initSchema(name, schema)](#new_Dialog_new)
    * [.start(msg, conversationName, schema, expireTime)](#Dialog+start) ⇒ [<code>Conversation</code>](#Conversation)
    * [.addConversation(conversation)](#ConversationManager+addConversation) ⇒ [<code>Conversation</code>](#Conversation)
    * [.resumeConversation(receiverUserId, conversationId)](#ConversationManager+resumeConversation) ⇒ <code>String</code>
    * [.pauseConversation(receiverUserId, conversationId)](#ConversationManager+pauseConversation) ⇒ <code>String</code>
    * [.pauseConversations(receiverUserId)](#ConversationManager+pauseConversations) ⇒ <code>Array.&lt;String&gt;</code>
    * [.getConversations(receiverUserId)](#ConversationManager+getConversations) ⇒ [<code>Array.&lt;Conversation&gt;</code>](#Conversation)
    * [.getConversation(receiverUserId, conversationId)](#ConversationManager+getConversation) ⇒ [<code>Conversation</code>](#Conversation)
    * [.cancelConversation(receiverUserId, conversationId, options)](#ConversationManager+cancelConversation) ⇒ <code>String</code>
    * [.cancelConversations(receiverUserId)](#ConversationManager+cancelConversations) ⇒ <code>String</code>
    * [.getCurrentConversation(receiverUserId)](#ConversationManager+getCurrentConversation) ⇒ [<code>Conversation</code>](#Conversation) \| <code>Null</code>
    * [.existsConversation(msg)](#ConversationManager+existsConversation)

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

<a name="ConversationManager+addConversation"></a>

### dialog.addConversation(conversation) ⇒ [<code>Conversation</code>](#Conversation)
Create a new conversation.

**Kind**: instance method of [<code>Dialog</code>](#Dialog)  
**Returns**: [<code>Conversation</code>](#Conversation) - Returns current conversation instance.  

| Param | Type | Description |
| --- | --- | --- |
| conversation | [<code>Conversation</code>](#Conversation) | a new conversation. |

<a name="ConversationManager+resumeConversation"></a>

### dialog.resumeConversation(receiverUserId, conversationId) ⇒ <code>String</code>
Resume a conversation.

**Kind**: instance method of [<code>Dialog</code>](#Dialog)  
**Returns**: <code>String</code> - Returns resume conversation message.  

| Param | Type | Description |
| --- | --- | --- |
| receiverUserId | <code>String</code> | `userId&roomId` or userId. |
| conversationId | <code>String</code> | conversation id. |

<a name="ConversationManager+pauseConversation"></a>

### dialog.pauseConversation(receiverUserId, conversationId) ⇒ <code>String</code>
Pause a conversation.

**Kind**: instance method of [<code>Dialog</code>](#Dialog)  
**Returns**: <code>String</code> - Returns pause conversation message.  

| Param | Type | Description |
| --- | --- | --- |
| receiverUserId | <code>String</code> | `userId&roomId` or userId. |
| conversationId | <code>String</code> | conversation id. |

<a name="ConversationManager+pauseConversations"></a>

### dialog.pauseConversations(receiverUserId) ⇒ <code>Array.&lt;String&gt;</code>
Pause all conversations.

**Kind**: instance method of [<code>Dialog</code>](#Dialog)  
**Returns**: <code>Array.&lt;String&gt;</code> - Returns all paused conversations messages.  

| Param | Type | Description |
| --- | --- | --- |
| receiverUserId | <code>String</code> | `userId&roomId` or userId. |

<a name="ConversationManager+getConversations"></a>

### dialog.getConversations(receiverUserId) ⇒ [<code>Array.&lt;Conversation&gt;</code>](#Conversation)
Get all conversations.

**Kind**: instance method of [<code>Dialog</code>](#Dialog)  
**Returns**: [<code>Array.&lt;Conversation&gt;</code>](#Conversation) - Returns the conversations of `receiverUserId`.  

| Param | Type | Description |
| --- | --- | --- |
| receiverUserId | <code>String</code> | `userId&roomId` or userId. |

<a name="ConversationManager+getConversation"></a>

### dialog.getConversation(receiverUserId, conversationId) ⇒ [<code>Conversation</code>](#Conversation)
Get a conversation.

**Kind**: instance method of [<code>Dialog</code>](#Dialog)  
**Returns**: [<code>Conversation</code>](#Conversation) - Returns the conversation.  

| Param | Type | Description |
| --- | --- | --- |
| receiverUserId | <code>String</code> | `userId&roomId` or userId. |
| conversationId | <code>String</code> | conversation id. |

<a name="ConversationManager+cancelConversation"></a>

### dialog.cancelConversation(receiverUserId, conversationId, options) ⇒ <code>String</code>
Cancel a conversation.

**Kind**: instance method of [<code>Dialog</code>](#Dialog)  
**Returns**: <code>String</code> - Returns cancel conversation message.  

| Param | Type | Description |
| --- | --- | --- |
| receiverUserId | <code>String</code> | `userId&roomId` or roomId. |
| conversationId | <code>String</code> | conversation id. |
| options | <code>Object</code> | cancel single, e.g. {single: true}. |

<a name="ConversationManager+cancelConversations"></a>

### dialog.cancelConversations(receiverUserId) ⇒ <code>String</code>
Cancel all conversations.

**Kind**: instance method of [<code>Dialog</code>](#Dialog)  
**Returns**: <code>String</code> - Returns cancel all conversations message.  

| Param | Type | Description |
| --- | --- | --- |
| receiverUserId | <code>String</code> | `userId&roomId` or userId. |

<a name="ConversationManager+getCurrentConversation"></a>

### dialog.getCurrentConversation(receiverUserId) ⇒ [<code>Conversation</code>](#Conversation) \| <code>Null</code>
Get current active conversation.

**Kind**: instance method of [<code>Dialog</code>](#Dialog)  
**Returns**: [<code>Conversation</code>](#Conversation) \| <code>Null</code> - Returns current conversation.  

| Param | Type | Description |
| --- | --- | --- |
| receiverUserId | <code>String</code> | `userId&roomId` or userId. |

<a name="ConversationManager+existsConversation"></a>

### dialog.existsConversation(msg)
Exists conversations.

**Kind**: instance method of [<code>Dialog</code>](#Dialog)  

| Param | Type | Description |
| --- | --- | --- |
| msg | <code>Object</code> | the current context. |


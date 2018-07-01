# sbot-conversation
A conversation session implement for [hubot](https://github.com/hubotio/hubot).

The conversation with the user is built around the concept of message models.

## Installation
```bash
npm install sbot-conversation
```
## Features
- conversation
- conversation manager

## Usage

### Create a conversation manager instance
There are there pattern to create a conversation.

### First pattern: Init a json schema

```javascript
//json schema example

  userSchema = {
    "type": 'object',
    "required": [
      'name'
      'email'
    ],
    "properties":{
      "name": {
        "description": 'full name',
        "type": 'string',
        "minLength": 8
      },
      "email": {
        "description": 'email address',
        "type": 'string',
        "format": 'email',
        "maxLength": 64
      },
      "employeeNum": {
        "description": 'employee Number',
        "type": 'integer',
        "minimum": 100,
        "maximum": 600
      },
      "gender": {
        "description": 'gender',
        "type": 'enum',
        "default": 'unspecified',
        "enum": [
          'unspecified'
          'male'
          'female'
        ]
      }
    }
  }

  schema = switchBoard.initSchema('User', userSchema)
  switchBoard.startDialog(msg, 'create user', schema)

```

### Second pattern: Init a message model
```javascript
// message model example

  onCompleteMessage: String // reply sent to the user when the conversation is done (optional)
  skipKeyword: String // default 'skip', a keyword that can be used to skip non-required questions (optional)
  skipMessage: String // a message that can be appended to any non-required questions (optional)
  type: "dynamic" // conversation schema type cloud be 'dynamic' (required)
  steps: [
    {
      question: String // question to ask the user (required)
      answer: {
        type: String // could be 'choice', 'text' (required)
        options: [ // add the options object if the `type` of answer is `choice`
          {
            match: String, // what robot should listen to - can be a regex
            validation: Object // validate input, refer json shcema (optional)
          }
        ]
      },
      required: Boolean
    }
  ]

  dynamicSchema = {
    onCompleteMessage: 'Create user successfully!! Thanks for reporting this.',
    type: "dynamic",
    steps: [
      {
        question: "Start create a user \nPlease enter your user name.",
        answer: {
          type: "text",
          validation:{
            "description": 'full name',
            "type": 'string',
            "minLength": 8
          }
        },
        required: true
      },
      {
        question: "Please enter your user email.",
        answer: {
          type: "text",
          validation:{
            "description": 'email address',
            "type": 'string',
            "format": 'email',
            "maxLength": 64
          }
        },
        required: true
      },
      {
        question: "Please enter employee Num.",
        answer: {
          type: "text",
          validation:{
            "description": 'employee Number',
            "type": 'integer',
            "minimum": 100,
            "maximum": 600
          }
        },
        required: false
      },
      {
        question: "Please enter gender enum[female, male, unspecified]"
        answer: {
          type: "choice",
          options: [
            {
              match: "unspecified"
            },
            {
              match: "male"
            },
            {
              match: "female"
            }
          ]
        },
        required: false
      }
    ]
  }

  schema = switchBoard.initSchema('User', dynamicSchema)
  switchBoard.startDialog(msg, 'create user(dynamic)', schema)

```

### Third pattern: custom
```coffee
//example

    conversation = switchBoard.startDialog(msg, 'create user(custom)')

    function1 = (message) ->
      conversation.updateAnswers('yes')
      message.reply('Please enter your user name.')
      conversation.updateQuestion('Please enter your user name.')
      conversation.addChoice(/.*/i, function2)

    function2 = (message) ->
      conversation.updateAnswers(message.message.text)
      message.reply("Please enter your user email.")
      conversation.updateQuestion("Please enter your user email.")
      conversation.addChoice(/.*/i, function3)

    function3 = (message) ->
      conversation.updateAnswers(message.message.text)
      message.reply("Please enter employee Num.")
      conversation.updateQuestion("Please enter employee Num.")
      conversation.addChoice(/.*/i, function4)

    function4 = (message) ->
      conversation.updateAnswers(message.message.text)
      message.reply('Create user successfully!! Thanks for reporting this.')
      conversation.emit 'end'

    function5 =  (message) ->
      conversation.emit 'end'
      message.reply('Bye bye!')

    msg.reply("Start create a user \n [yes]or [no]?")
    conversation.updateQuestion("Start create a user \n [yes]or [no]?")
    conversation.addChoice(/yes/i, function1)
    conversation.addChoice(/no/i, function5)

```

### API
###### conversation is an instance of an EventEmitter
###### It emits an `end` event when the dialog with the user is done

##### robot.e.createDialog(robot)

Returns a Dialog singleton object.

**robot**: instance of hubot's `Robot`.
e.g.

```coffee
  switchBoard = robot.e.createDialog(robot)
```
##### initSchema(schemaName, [schema])

Returns a new conversation schema object.

**schemaName**: instance of hubot's `Robot`.

**schema**:  `pattern one json schema` or `pattern two message model`.


##### startDialog(msg, conversationName, schema, expireTime)

Returns a new conversation object, with a default expire time 1h.

**msg**: An incoming message heard / responded to by the robot.
 eg:

 ```javascript
 robot.respond(/foo/,function(msg){
    var dialog = conversation.startDialog(msg);
 })
 ```

**conversationName**:  conversation name.

**schema**: schema object.

**expireTime**: expire time.

##### addChoice(regex, handler)

 Adds a listener choice to this Dialog.
 If a message is received that matches the choice `regex`, the handler will be executed.

 **regex**: a regular expresion that will be aplied to the incoming message from the receive function

 **handler**: function(message),  A function that is executed against a successfully matched message. The `match` property of the
 original

##### updateQuestion(value)

Update all answers.

**value**: String - question

##### updateAnswers(value)

Update last question.

**value**: String - answer

### conversation manager command

##### show conversation {conversationId|all}
eg:

  show conversation all

  show conversation 56465621321

  show conversation

##### resume conversation {conversationId}
eg:

  resume conversation 56465621321

  resume conversation

##### cancel conversation {conversationId|all}
eg:

  cancel conversation all

  cancel conversation 56465621321

  cancel conversation

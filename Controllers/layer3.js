require('dotenv').config();

async function sendLesson3(req,res){
    const input = req.body.prompt;
    const prompt = `Describe in details and give comprehensive insights about the lesson: ${input.lessonName}. Here is a quick intro about this lesson: ${input.lessonContent}. The lesson should be in context of the subject: ${input.subject}. This lesson is a part of the chapter: ${input.chapter}. At the level: ${input.level}.`
    var messages=[];

    console.log('processing...');
    
    const { DiscussServiceClient } = require("@google-ai/generativelanguage");
    const { GoogleAuth } = require("google-auth-library");

    const MODEL_NAME = "models/chat-bison-001";
    const API_KEY = process.env.API_KEY;

    const client = new DiscussServiceClient({
        authClient: new GoogleAuth().fromAPIKey(API_KEY),
    });

    let PaLM_res;
    const context = `Describe in details and give comprehensive insights about the lesson: ${input.lessonName}. Here is a quick intro about this lesson: ${input.lessonContent}. The lesson should be in context of the subject: ${input.subject}. This lesson is a part of the chapter: ${input.chapter}. At the level: ${input.level}.`;
    const examples = [];
    
    console.log(`Prompt arrived..... ${prompt}`)
    // log(`Prompt arrived..... ${prompt}`);
    messages.push({"content":prompt});
    try {
        const result = await client.generateMessage({
            model: MODEL_NAME,
            temperature: 0.6,
            candidateCount: 1,
            top_k: 50,
            top_p: 0.9,
            prompt: {
                context: context,
                examples: examples,
                messages: messages,
            },
        });
        const resp = result[0].candidates[0].content;
        // if(sizeInBytes>=20000){
        //     messages.pop();
        // }
        messages.push({"content":resp});

        function getArraySizeInBytes(arr) {
            var jsonString = JSON.stringify(arr);
            var bytes = Buffer.from(jsonString).length;
            return bytes;
        }
        var sizeInBytes = getArraySizeInBytes(messages);
        
        // console.log(`\n⚡Prompt: ${convo.prompt}\n✨Response:${convo.resp}`);
        console.log(`✨ ${resp}`);
        console.log(`Size of request payload: ${sizeInBytes} bytes`);
        res.status(200).json({ result: `${resp}` });
    } catch (error) {
        console.error('Error:', error);
        res.status(200).json({ result:""});
    }
    // console.log(messages);
    messages.push({"content":"NEXT REQUEST"});
}

module.exports = sendLesson3;
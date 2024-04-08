require('dotenv').config();

//REQUIREMENTS: req.body must have prompt:{
    // "levelName": "<LEVEL NAME>",
    // "levelContent": "<LEVEL INFO>",
    // "subject":"<SUBJECT NAME>" }

async function postLayer1(req,res){
    const input = req.body.prompt; //should contain levelName, levelContent and Subject
    const prompt = `List out all possible chapters for the topic content: ${input.levelContent}, and topic level: ${input.levelName} `
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
    const level = req.body.level;
    // const context = `Give an array of possible lessons for the given topic ${prompt}. Consider the name of level : ${}`;
    const context = `List possible chapers for the topic content: ${input.levelContent}, for topic level: ${input.levelName}, and the Subject: ${input.subject}. It must be a final list of all the possible chapters`
    const examples = [];
    
    console.log(`Prompt arrived..... ${prompt}`);
    
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

        const lines = resp.split("\n");
        const topics = [];

        lines.forEach((line) => {
        
        if (line.startsWith("* **") || line.startsWith("*") || line.startsWith(" *")) {
            const topicName = line.replace("* **", "").replace("*","").trim();
            topics.push(topicName);

        }
        });

        console.log("🔥🔥",topics);
        const output = {
            chapters: topics,
            level:input.levelName,
            subject:input.subject
        }
        console.log(`Size of request payload: ${sizeInBytes} bytes`);
        res.status(200).json(output);
    } catch (error) {
        console.error('Error:', error);
        res.status(200).json({ result:""});
    }
    // console.log(messages);
    messages.push({"content":"NEXT REQUEST"});
}

module.exports = postLayer1;
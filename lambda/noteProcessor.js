exports.handler = async (event) => {
    try {
        console.log("New file uploaded to S3");

        event.Records.forEach(record => {
            const bucket = record.s3.bucket.name;
            const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, " "));

            console.log("Bucket:", bucket);
            console.log("File:", key);
        });

        return {
            statusCode: 200,
            body: "File processed successfully"
        };

    } catch (error) {
        console.error(error);

        return {
            statusCode: 500,
            body: "Lambda Error"
        };
    }
};
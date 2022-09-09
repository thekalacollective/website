// src/pages/api/examples.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "../../env/server.mjs";

type MediaUploadType = {
  extension: string;
  fileName: string;
  userId: string;
};

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const S3 = new S3Client({
  region: "us-west-004",
  endpoint: `https://s3.us-west-004.backblazeb2.com`,
  credentials: {
    accessKeyId: env.B2_ACCESS_KEY_ID,
    secretAccessKey: env.B2_APPLICATION_KEY,
  },
});

const restricted = async (req: NextApiRequest, res: NextApiResponse) => {
  const { fileName, extension, userId } = req.query as MediaUploadType;

  const signedUrl = await getSignedUrl(
    S3,
    new PutObjectCommand({
      Bucket: env.B2_BUCKET_NAME,
      Key: `${userId}/${fileName}.${extension}`,
      ContentType: `image/${extension}`,
    }),
    { expiresIn: 3600 }
  ).catch((e) =>
    res.status(500).send({ error: e, message: "An error occured" })
  );

  if (signedUrl) {
    res.status(200).send(signedUrl);
  } else {
    res.status(500).send("An error occured");
  }
};

export default restricted;

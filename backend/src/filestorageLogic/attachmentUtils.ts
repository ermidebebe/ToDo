import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)
// TODO: Implement the fileStogare logic

export class AttachmentUtils
{
   
   s3: AWS.S3 =new XAWS.S3()
   s3_bucket_name: string=process.env.ATTACHMENT_S3_BUCKET
   expiry: string= process.env.SIGNED_URL_EXPIRATION
   
   generate_url(todoId:string) {
      const params = {Bucket: this.s3_bucket_name, Key: todoId,Expires:this.expiry};
      const url = this.s3.getSignedUrl('getObject', params);
    return url
   }
}
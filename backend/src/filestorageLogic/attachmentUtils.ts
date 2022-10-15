import * as AWS from 'aws-sdk'
import { createLogger } from '../utils/logger'
const logger = createLogger('AttachementUtils')
import * as AWSXRay from 'aws-xray-sdk'

export class AttachmentUtils
{
   XAWS = AWSXRay.captureAWS(AWS)
   s3: AWS.S3 =new this.XAWS.S3({
      signatureVersion: 'v4'
    })
   s3_bucket_name: string=process.env.ATTACHMENT_S3_BUCKET
   expiry: string= process.env.SIGNED_URL_EXPIRATION
   
   async generate_url(todoId:string) {

      const params = {Bucket: this.s3_bucket_name, Key: todoId,Expires:Number(this.expiry)};
      const url = this.s3.getSignedUrl('putObject', params);
      logger.info(url)
    return url
   }
}
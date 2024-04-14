import { FirebaseFactory } from '@/db/firebase.factory'
import { UserEntity } from '@/graphql/user/gql/user.entity'
import { ENV } from '@/utils/env'
import { Injectable } from '@nestjs/common'
import config from 'config'
import admin, { ServiceAccount } from 'firebase-admin'

@Injectable()
export class DbService {
private adminSDK: ServiceAccount
    private firebaseApp: admin.app.App
    private firebaseFirestore: admin.firestore.Firestore

    public users: FirebaseFactory<UserEntity>

    constructor() {
        this.adminSDK = {
            type: config.get<string>('firebase.admin.type'),
            project_id: config.get<string>('firebase.admin.project_id'),
            private_key_id: config.get<string>('firebase.admin.private_key_id'),
            private_key: config.get<string>('firebase.admin.private_key'),
            client_email: config.get<string>('firebase.admin.client_email'),
            client_id: config.get<string>('firebase.admin.client_id'),
            auth_uri: config.get<string>('firebase.admin.auth_uri'),
            token_uri: config.get<string>('firebase.admin.token_uri'),
            client_x509_cert_url: config.get<string>('firebase.admin.auth_provider_x509_cert_url'),
            auth_provider_x509_cert_url: config.get<string>('firebase.admin.client_x509_cert_url'),
        } as ServiceAccount
        this.firebaseApp =
            admin.apps.length > 0
                ? admin.app()
                : admin.initializeApp({
                      credential: admin.credential.cert(this.adminSDK as ServiceAccount),
                  })
        this.firebaseFirestore = admin.firestore()

        this.users = new FirebaseFactory(this.firebaseFirestore, this.getCollectionName('users'))
    }

    private getCollectionName(collectionName: string): string {
        return `${ENV.getNodeEnvShort()}__${collectionName}`
    }
}

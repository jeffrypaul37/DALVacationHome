// src/utils/getCurrentUser.js
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import { poolData } from '../aws-config';

const userPool = new CognitoUserPool(poolData);

export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser != null) {
      cognitoUser.getSession((err, session) => {
        if (err) {
          reject(err);
        } else {
          cognitoUser.getUserAttributes((err, attributes) => {
            if (err) {
              reject(err);
            } else {
              const userAttributes = {};
              for (let attribute of attributes) {
                userAttributes[attribute.Name] = attribute.Value;
              }
              resolve(userAttributes);
            }
          });
        }
      });
    } else {
      reject('No user is currently logged in.');
    }
  });
};

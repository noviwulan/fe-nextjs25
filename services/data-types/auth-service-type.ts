import callAPI from '@/config/api';

const ROOT_API = process.env.NEXT_PUBLIC_API;
const API_VERSION = 'api/v1';

export async function signUpService(data: FormData) {
  const url = `${ROOT_API}/${API_VERSION}/auth/signup`;

  return callAPI({
    url,
    method: 'POST',
    data,
  });
}

export async function signInService(data: FormData) {
  const url = `${ROOT_API}/${API_VERSION}/auth/signin`;

  return callAPI({
    url,
    method: 'POST',
    data,
  });
}

export async function signOutService() {
  const url = `${ROOT_API}/${API_VERSION}/auth/logout`;

  return callAPI({
    url,
    method: 'POST',
    token: true,
  });
}
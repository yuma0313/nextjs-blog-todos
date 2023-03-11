import { useState } from 'react';
import Router, { useRouter } from 'next/router';
import Cookie from "universal-cookie";
import { LockClosedIcon } from '@heroicons/react/solid'

const cookie = new Cookie();

export default function Auth() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState("");

  const login = async () => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/auth/jwt/create`,
        {
          method: "POST",
          body: JSON.stringify({ username: username, password: password}),
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        if (res.status === 400) {
          throw "Authentication failed";
        } else if (res.ok) {
          return res.json();
        }
      })
      .then((data) => {
        const options = {path: "/"};
        cookie.set("access_token", data.access, options)
      });
      router.push("/main-page");
    } catch(err) {
      alert(err);
    }
  }

  const authUser = async (e) => {
    e.preventDefault();
    if (isLogin) {
      login();
    } else {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_RESTAPI_URL}api/register/`, {
          method: "POST",
          body: JSON.stringify({ username: username, password: password }),
          headers: {
            "Content-Type": "application/json",
          },
        }).then((res) => {
          if (res.status === 400) {
            throw "authentication failed";
          }
        });
        login();
      } catch (err) {
        alert(err);
      }
    }
  };

  return <div className="w-full max-w-md space-y-8">
  <div>
    {/* eslint-disable-next-line @next/next/no-img-element */} 
    <img
      className="mx-auto h-12 w-auto"
      src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
      alt="Your Company"
    />
    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
      {isLogin ? "Login" : "Sign up"}
    </h2>
  </div>
  <form className="mt-8 space-y-6" onSubmit={authUser}>
    <input type="hidden" name="remember" defaultValue="true" />
    <div className="-space-y-px rounded-md shadow-sm">
      <div>
        <input
          name="username"
          type="text"
          autoComplete="username"
          required
          className="relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="Username"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
      </div>
      <div>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
      </div>
    </div>

    <div className="flex items-center justify-center">

      <div className="text-sm">
        <span onClick={() => setIsLogin(!isLogin)} className='cursor-pointer font-medium text-white hover:text-ingigo-500'>
          change mode?
        </span>
      </div>
    </div>

    <div>
      <button
        type="submit"
        className="group relative flex w-full justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 cursor-pointer">
          <LockClosedIcon className="h-5 w-5 text-white group-hover:text-indigo-400" aria-hidden="true" />
        </span>
        {isLogin ? "Login with JWT" : "Create New User"}
      </button>
    </div>
  </form>
</div>;
}
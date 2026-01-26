import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';

export const Login = () => {
  const [state, setState] = useState('login'); // "login" or "register"
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { axios, setToken } = useAppContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Prepare payload based on login/register
    const payload = state === 'login' ? { email, password } : { name, email, password };
    const url = state === 'login' ? '/api/user/login' : '/api/user/register';

    try {
      const { data } = await axios.post(url, payload);
      console.log('API response:', data); // Debug

      if (data.success) {
        setToken(data.token);
        localStorage.setItem('token', data.token);
        toast.success(state === 'login' ? 'Logged in successfully!' : 'Account created successfully!');
        // Optionally, redirect user here
      } else {
        toast.error(data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('API error:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setLoading(false);
    }
  };

  return (

    <>
    <Toaster
  position="top-center"
  toastOptions={{
    style: {
      
      width: '100%',        // main area width
      display: 'flex',
      justifyContent: 'center'
    }
  }}
/>
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] text-gray-500 rounded-lg shadow-xl border border-gray-200 bg-white"
    >
      <p className="text-2xl font-medium m-auto">
        <span className="text-gray-700">User</span> {state === 'login' ? 'Login' : 'Sign Up'}
      </p>

      {/* Name input only for register */}
      {state === 'register' && (
        <div className="w-full">
          <p>Name</p>
          <input
            type="text"
            placeholder="Type here"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-gray-700"
            required
          />
        </div>
      )}

      {/* Email */}
      <div className="w-full">
        <p>Email</p>
        <input
          type="email"
          placeholder="Type here"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-200 rounded w-full p-2 mt-1 outline-gray-700"
          required
        />
      </div>

      {/* Password */}
      <div className="w-full">
        <p>Password</p>
        <input
          type="password"
          placeholder="Type here"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-gray-200 rounded w-full p-2 mt-1 outline-gray-700"
          required
        />
      </div>

      {/* Toggle login/register */}
      {state === 'register' ? (
        <p>
          Already have an account?{' '}
          <span
            onClick={() => setState('login')}
            className="text-gray-700 cursor-pointer hover:underline"
          >
            Click here
          </span>
        </p>
      ) : (
        <p>
          Create an account?{' '}
          <span
            onClick={() => setState('register')}
            className="text-gray-700 cursor-pointer hover:underline"
          >
            Click here
          </span>
        </p>
      )}

      {/* Submit button */}
      <button
        type="submit"
        className={`bg-gray-700 hover:bg-gray-800 transition-all text-white w-full py-2 rounded-md cursor-pointer ${
          loading ? 'opacity-70 cursor-not-allowed' : ''
        }`}
        disabled={loading}
      >
        {loading ? 'Processing...' : state === 'register' ? 'Create Account' : 'Login'}
      </button>
    </form>
    </>
  );
};

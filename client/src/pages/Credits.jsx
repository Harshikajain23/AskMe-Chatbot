import React, { useEffect, useState } from 'react'
import { dummyPlans } from '../assets/assets'
import { Loading } from './Loading'
import { useAppContext } from '../context/AppContext'
import toast , {Toaster} from 'react-hot-toast'


const Credits = () => {

   const { token , axios} = useAppContext() 

  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)


 const fetchPlans = async () => {
  try {
    const { data } = await axios.get('/api/credit/plan')

    if (data.success) {
      setPlans(data.plans)
    } else {
      toast.error(data.message || 'Failed to fetch plans.')
    }
  } catch (error) {
    toast.error(error.response?.data?.message || error.message)
  } finally {
    setLoading(false)
  }
}

 

useEffect(() => {
  console.log("TOKEN FROM CONTEXT:", token)
  console.log("TOKEN FROM LOCALSTORAGE:", localStorage.getItem("token")), fetchPlans()
}, [token])


  if(loading) return <Loading/>

  // ===== Add this function for Razorpay payment =====
  const handleBuy = async (planId) => {
  if (!token) {
    alert('Please login to buy credits');
    return;
  }

  try {
    console.log("TOKEN SENT TO BACKEND:", token);

    const { data } = await axios.post(
      '/api/credit/purchase',
      { planId }, // request body
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("API response:", data);


    if (!data.success) return alert(data.message);



    const { order, razorpayKey, transactionId } = data;

    // Setup Razorpay options
    const options = {
      key: razorpayKey,
      amount: order.amount,
      currency: order.currency,
      name: 'AskMe Chatbot',
      description: `Purchase ${order.notes.planName} Plan`,
      order_id: order.id,
      handler: function (response) {
        console.log('Payment Success:', response);
        alert('Payment successful!');
      },
      prefill: {
        name: 'Test User',
        email: 'test@example.com',
      },
      notes: {
        transactionId,
      },
      theme: {
        color: '#3399cc',
      },
    };

   

    

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (err) {
    console.error(err);
    alert('Something went wrong');
  }
};


  return (
    <div className='max-w-7xl h-screen overflow-y-scroll mx-auto px-4 sm:px-6'>
          
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
      
      <h2 className='text-3xl font-semibold text-center mb-10 xl:mt-30 text-gray-800 dark:text-white'> Credit Plans</h2>

      <div className='flex flex-wrap justify-center gap-8'>  
        {plans.map((plan)=> (
          <div key={plan._id} className={`border border-gray-200 dark:border-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow p-6 min-w-[300px] flex flex-col ${plan._id === 'pro' ? "bg-gray-50 dark:bg-gray-900" : "bg-white dark:bg-transparent"}`}> 
            <div className='flex-1'>
              <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>{plan.name} </h3>
              <p className='text-2xl font-bold text-gray-600 dark:text-gray-300 mb-4'>₹ {plan.price}
                <span className='text-base font-normal text-gray-600 dark:text-gray-200'> {' '}/ {plan.credits} credits </span>
              </p>
              <ul className='list-disc list-inside text-sm text-gray-700 dark:text-gray-200 space-y-1'>
                {plan.features.map((feature, index)=> (
                  <li key = {index}> {feature}</li>
                ))}
              </ul>
            </div>

            {/* ===== Call handleBuy on button click ===== */}
            <button 
              onClick={() => handleBuy(plan._id)}
              className='my-6 bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-white font-medium py-2 rounded transition-colors cursor-pointer'>
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Credits

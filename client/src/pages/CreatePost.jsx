import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { preview } from '../assets';
import { getRandomPrompt } from '../utils';
import { FormField, Loader } from '../components';

const CreatePost = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    prompt: '',
    photo: '',
  });
  const [nameIsValid, setNameIsValid] = useState(true);
  const [promptIsValid, setPromptIsValid] = useState(true);

  const [generatingImg, setGeneratingImg] = useState(false);
  const [loading, setLoading] = useState(false);
  const [photoIsValid, setPhotoIsValid] = useState(true);
  const [formisValid, setFormIsValid] = useState(false);

  // useEffect(() => {
  //   setFormIsValid(
  //     form.name.trim().length > 0 && form.prompt.trim().length > 0 && form.photo
  //   );
  // }, [form.name, form.prompt, form.photo]);

  const generateImage = async () => {
    if (form.prompt.trim()) {
      try {
        setGeneratingImg(true);
        const response = await fetch('http://localhost:8080/api/v1/aiImage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: form.prompt }),
        });
        const data = await response.json();

        setForm({ ...form, photo: `data:image/jpeg;base64,${data.photo}` });
        setPhotoIsValid(true);
      } catch (error) {
        alert(error);
      } finally {
        setGeneratingImg(false);
      }
    } else {
      setPromptIsValid(false);
    }
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setNameIsValid(false);
      return;
    }
    if (!form.prompt.trim()) {
      setPromptIsValid(false);
      return;
    }
    if (!form.photo) {
      setPhotoIsValid(false);
      return;
    }
    if (form.prompt.trim() && form.photo && form.name.trim()) {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8080/api/v1/post', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form),
        });
        await response.json();
        navigate('/');
      } catch (error) {
        alert(error);
      } finally {
        setLoading(false);
      }
    } else {
    }
  };
  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });

    if (event.target.name === 'name') {
      setNameIsValid(true);
    } else if (event.target.name === 'prompt') {
      setPromptIsValid(true);
    }
  };
  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompt(form.prompt);
    setForm({ ...form, prompt: randomPrompt });
    setPromptIsValid(true);
  };
  return (
    <section className='max-w-7xl mx-auto'>
      <div>
        <h1 className='font-extrabold text-[#222328] text-[32px]'>Create</h1>
        <p className='mt-2 text-[#666e75] text-[16px] max-w-[500px]'>
          Create imaginative and visually stunning images through DALL-E AI
          Image creator and share them with the community.
        </p>
      </div>
      <form className='mt-16 max-w-3xl' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-5'>
          <FormField
            labelName='Your Name'
            type='text'
            name='name'
            placeholder='John Doe'
            value={form.name}
            handleChange={handleChange}
          />
          {!nameIsValid && (
            <p className='text-red-700 text-sm'>Please enter a name.</p>
          )}
          <FormField
            labelName='Prompt'
            type='text'
            name='prompt'
            placeholder='A plush toy robot sitting against a yellow wall'
            value={form.prompt}
            handleChange={handleChange}
            isSurpriseMe
            handleSurpriseMe={handleSurpriseMe}
          />
          {!promptIsValid && (
            <p className='text-red-700 text-sm'>Please enter a prompt.</p>
          )}
          <div className='relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64 p-3 h-64 flex justify-center items-center'>
            {form.photo ? (
              <img
                src={form.photo}
                alt={form.prompt}
                className='w-full h-full object-contain'
              />
            ) : (
              <img
                src={preview}
                alt='preview'
                className='w-9/12 h-9/12 object-contain opacity-40'
              />
            )}

            {generatingImg && (
              <div className='absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg'>
                <Loader />
              </div>
            )}
          </div>
          {!photoIsValid && (
            <p className='text-red-700 text-sm'>
              Please generate an image first!
            </p>
          )}
        </div>
        <div className='mt-5 flex gap-5'>
          <button
            type='button'
            onClick={generateImage}
            className='text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center'
          >
            {generatingImg ? 'Generating...' : 'Generate'}
          </button>
        </div>
        <div className='mt-10'>
          <p className='mt-2 text-[#666e75] text-[14px]'>
            Once you have created the image you want, you can share with others
            in the community.
          </p>
          <button
            type='submit'
            className='mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center'
          >
            {loading ? 'Sharing...' : 'Share with the community.'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default CreatePost;

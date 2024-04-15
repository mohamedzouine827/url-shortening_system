import React, { useState } from 'react';

function App() {
  const [input, setInput] = useState("");
  const [shortenInput, setShortenInput] = useState("");
  const [shorten, setShorten] = useState("");
  const [error, setError] = useState("");

  const generateUniqueId = () => {
    const lowerCase = "abcdefghijklmnopqrstuvwxyz";
    const upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const digits = "0123456789";
    const allChar = lowerCase + upperCase + digits;
    const length = 8;
    let uniqueId = "";
    for (let i = 0; i < length; i++) {
      uniqueId += allChar.charAt(Math.floor(Math.random() * allChar.length));
    }
    return uniqueId;
  };

  const handleDb = async () => {
    try {
      let slug;
      let isUnique = false;

      while (!isUnique) {
        slug = generateUniqueId();
        // Assuming the JSON server is running locally at http://localhost:5000
        const response = await fetch(`http://localhost:5000/urls?slug=${slug}`);
        const data = await response.json();
        if (data.length === 0) {
          isUnique = true;
        }
      }

      // Posting the shortened URL to the JSON server
      await fetch('http://localhost:5000/urls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: shortenInput,
          slug: slug
        }),
      });

      setShorten(`${window.location.origin}/${slug}`);
      setError(""); // Resetting error state after successful shortening
    } catch (error) {
      setError("Error occurred while shortening URL");
      console.error("Error occurred while shortening URL:", error);
    }
  };

  const parser = (inputText) => {
    // Parsing logic based on the last occurrence of "/"
    const lastSlashIndex = inputText.lastIndexOf("/");
    if (lastSlashIndex !== -1) {
      return inputText.substring(lastSlashIndex + 1);
    } else {
      return inputText;
    }
  };

  const handleRedirect = async () => {
    try {
      const response = await fetch(`http://localhost:5000/urls?slug=${input}`);
      const data = await response.json();
      if (data.length === 0) {
        alert('URL not found');
        return;
      }
      let redirectUrl = data[0].url;
      window.open(redirectUrl, "_blank");
    } catch (error) {
      console.error("Error occurred while redirecting:", error);
      alert('Error occurred while redirecting');
    }
  };

  return (
    <div className="px-6 py-8">
      <div className="text-3xl">
        URL SHORTENER
      </div>
      <div className="flex flex-col gap-2">
        <input type="text" required value={shortenInput} placeholder="Enter URL to shorten" className="border-2 w-[80vw]" onChange={e => setShortenInput(e.target.value)} />
        <button onClick={handleDb} className="bg-black text-white w-24 hover:bg-gray-900 transition-all duration-500 ease-in-out">Shorten</button>
      </div>
      {error && <div className="text-red-600 mt-2">{error}</div>}
      <div className="bg-gray-400 h-8 w-[57vw] mt-4 py-2 pl-1 flex text-center items-center">
        {shorten && <a href={shorten} target="_blank" rel="noopener noreferrer">{shorten}</a>}
      </div>
      <div className="mt-4 flex flex-col gap-2">
        <input
          type="text"
          placeholder="Enter shortened link"
          className="border-2 w-[80vw]"
          value={input}
          onChange={(e) => setInput(parser(e.target.value))}
        />
        <button onClick={handleRedirect} className="bg-blue-500 text-white w-24 hover:bg-blue-600 transition-all duration-500 ease-in-out">Go</button>
      </div>
    </div>
  );
}

export default App;

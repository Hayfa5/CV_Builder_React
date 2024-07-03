import React, { useState, useEffect } from "react";
import axios from "axios";
import "./DescriptionAnalysis.scss";

import { register } from 'swiper/element/bundle';
import Swiper from "swiper";
import { Link } from "react-router-dom";
import * as tf from '@tensorflow/tfjs';
import * as use from '@tensorflow-models/universal-sentence-encoder';

function DescriptionAnalysis() {
  const [inputText1, setInputText1] = useState("");
  const [inputText2, setInputText2] = useState("");
  const [model, setModel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [similarity, setSimilarity] = useState(null);

  const handleInputChange1 = (event) => {
    setInputText1(event.target.value);
  };

  const handleInputChange2 = (event) => {
    setInputText2(event.target.value);
  };

  useEffect(() => {
    async function loadModel() {
      const loadedModel = await use.load();
      setModel(loadedModel);
      setIsLoading(false);
    }
    loadModel();
  }, []);

  const calculateKeywordSimilarity = (text1, text2) => {
    const words1 = text1.toLowerCase().match(/\b\w+\b/g);
    const words2 = text2.toLowerCase().match(/\b\w+\b/g);
    const uniqueWords1 = new Set(words1);
    const uniqueWords2 = new Set(words2);
    const frequencyVector1 = {};
    const frequencyVector2 = {};
    for (const word of uniqueWords1) {
      frequencyVector1[word] = (words1.filter(w => w === word).length) / words1.length;
    }
    for (const word of uniqueWords2) {
      frequencyVector2[word] = (words2.filter(w => w === word).length) / words2.length;
    }
    let dotProduct = 0;
    for (const word in frequencyVector1) {
      if (frequencyVector2.hasOwnProperty(word)) {
        dotProduct += frequencyVector1[word] * frequencyVector2[word];
      }
    }
    const norm1 = Math.sqrt(Object.values(frequencyVector1).reduce((acc, val) => acc + val * val, 0));
    const norm2 = Math.sqrt(Object.values(frequencyVector2).reduce((acc, val) => acc + val * val, 0));
    const similarity = dotProduct / (norm1 * norm2);
    return similarity;
  };

  const handleSimilarityCalculation = async () => {
    if (!model || !inputText1.trim() || !inputText2.trim()) return;
    
    const inputEmbedding1 = await model.embed(inputText1.trim().toLowerCase());
    const inputEmbedding2 = await model.embed(inputText2.trim().toLowerCase());

    const semanticSimilarity = tf.sum(tf.mul(inputEmbedding1, inputEmbedding2)).dataSync()[0];
    
    const keywordSimilarity = calculateKeywordSimilarity(inputText1, inputText2);

    setSimilarity({
      semantic: semanticSimilarity,
      keyword: keywordSimilarity,
    });
  };

  return (
    <div className="add">
      <div className="container">
        <div className="sections">
          <div className="info">
            <textarea
              value={inputText1}
              onChange={handleInputChange1}
              placeholder="Text 1"
              rows="8"
              cols="40"
              style={{ border: "1px solid black" }}
            ></textarea>
            <br />
            <textarea
              value={inputText2}
              onChange={handleInputChange2}
              placeholder="Text 2"
              rows="8"
              cols="40"
              style={{ border: "1px solid black" }}
            ></textarea>
            <br />
            <button onClick={handleSimilarityCalculation} className="btn btn-dark" style={{ width: "100%", height: "15%" }}>
              Calculate Similarity
            </button>
            {similarity && (
              <div>
                <p>Semantic Similarity: {similarity.semantic}</p>
                <p>Keyword Similarity: {similarity.keyword}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DescriptionAnalysis;

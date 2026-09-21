/* TECHNICAL SKILLS
   Six groups in a two-column grid, rendered in this order.
   To add a skill, add a string to the right `items` list. Nothing else.
   The separators between skills are drawn by CSS, not typed here.
   
   Fields that accept HTML are marked below; everywhere else < > & are
   printed literally, so write a plain ampersand and a plain apostrophe.

   Edit this file, then run `npm run build`. */

module.exports = [
  {
    title: 'Programming & Scripting',
    items: [
      'Python', 'SQL', 'R', 'Java', 'C++', 'Typescript', 'Bash', 'PowerShell',
      'VBA (Excel Macros)'
    ]
  },
  {
    title: 'GenAI & LLM Systems',
    items: [
      'LangChain', 'LangGraph', 'RAG', 'MCP', 'LLM Evaluation', 'OpenAI API', 'Qdrant',
      'Ollama', 'OpenAI Tool / Function Calling', 'Agentic AI', 'Human-in-the-Loop Systems',
      'Vector DBs', 'FAISS'
    ]
  },
  {
    title: 'Machine Learning',
    items: [
      'PyTorch', 'TensorFlow/Keras', 'Scikit-learn', 'XGBoost', 'LightGBM', 'MLflow',
      'Optuna', 'SHAP', 'OpenCV', 'ResNet', 'ONNX', 'ARIMA', 'GANs', 'Feature Engineering'
    ]
  },
  {
    title: 'Data Engineering & Quality',
    items: [
      'dbt', 'Apache Airflow', 'PySpark', 'Snowflake', 'Apache Kafka', 'MongoDB', 'PostgreSQL',
      'Great Expectations', 'ETL/ELT Pipelines', 'Databricks'
    ]
  },
  {
    title: 'Cloud, MLOps & APIs',
    items: [
      'AWS (EC2, VPC, Auto Scaling, AWS CDK)', 'Microsoft Azure', 'FastAPI', 'Docker',
      'GitLab CI/CD', 'REST APIs', 'Model Serving'
    ]
  },
  {
    title: 'Analytics & Visualization',
    items: [
      'Power BI', 'Tableau', 'DAX', 'Streamlit', 'Advanced Excel', 'Statistical Analysis',
      'Forecasting'
    ]
  }
];

/* EXPERIENCE
   Newest role first. Each paragraph is printed exactly as written here, so
   this file is the single source of truth for that prose.

   logo    file in assets/logos/
   logoClass (optional)
           logo--color      keep the mark in its own colour instead of mono
           tl__logo--tcs    narrower height for the very wide TCS wordmark
           tl__logo--ford   narrower height for the Ford oval

   Fields that accept HTML are marked below; everywhere else < > & are
   printed literally, so write a plain ampersand and a plain apostrophe.
   No field here accepts HTML.

   Edit this file, then run `npm run build`. */

module.exports = [
  {
    period: 'Jun 2026 - Present',
    role: 'Software Engineer - AI & Data',
    org: 'Heartland Community Network',
    logo: 'heartland.png',
    logoAlt: 'Heartland Community Network',
    paragraphs: [
      'At Heartland Community Network, I build the software behind AI solutions for clients across Indiana. My focus is turning AI prototypes into dependable production services. That means designing the service layer, deciding how systems should fail safely, and working closely with researchers and client stakeholders to get there.',
      'I architected a distributed Python and FastAPI service layer for AI-assisted intake and triage, with MCP-controlled tool execution, asynchronous orchestration, idempotent retries, and PostgreSQL state management. This brought failed workflow executions down from 14 to 3 per month.',
      'I delivered these services as containers on AWS EKS and Kubernetes, with Redis-backed coordination, GitLab CI/CD, and CloudWatch observability. This let the shared platform grow to 4 client workflows across 3 cross-functional delivery teams.',
      'Along the way, I partnered with AI researchers and client stakeholders to turn RAG and agentic AI prototypes into production software. I defined service contracts, test suites, failure handling, code-review standards, and human-in-the-loop safeguards so the systems could be deployed reliably.'
    ],
    tags: [
      'Python', 'FastAPI', 'Distributed Systems', 'Model Context Protocol (MCP)',
      'AWS EKS', 'Kubernetes', 'PostgreSQL', 'Redis', 'GitLab CI/CD',
      'Amazon CloudWatch'
    ]
  },
  {
    period: 'Oct 2024 - May 2026',
    role: 'Software Engineer - Data Operations',
    org: 'Indiana University Bloomington',
    logo: 'iu.png',
    logoAlt: 'Indiana University Bloomington',
    logoClass: 'logo--color',
    paragraphs: [
      'At Indiana University Bloomington, I worked as a software engineer on the data services behind inventory and procurement applications for a university operations team. My work focused on making data processing faster, cheaper, and safer to change.',
      'I scaled Python, SQL, and PySpark processing across more than 10M transactional records, raising sustained throughput from 1.2M to 3.4M rows per hour with partition-aware execution, parallel workloads, and better data-access patterns. I also restructured dbt transformations, consolidated Databricks workloads, and right-sized Snowflake compute around actual demand, which lowered analytics infrastructure spend by $4.2K per month.',
      'To make releases safer, I set up automated testing, Git-based code review, and GitLab CI/CD for production data services. Deployments went from 1 to 6 production changes per month, with standardized rollback and release validation. I also designed Kafka-backed event ingestion and FastAPI service boundaries, which gave operational systems and analytics workloads durable data contracts and reusable interfaces.'
    ],
    tags: [
      'Python', 'SQL', 'PySpark', 'Apache Kafka', 'FastAPI', 'dbt', 'Databricks',
      'Snowflake', 'GitLab CI/CD', 'Data Engineering'
    ]
  },
  {
    period: 'May 2025 - Aug 2025',
    role: 'Data Scientist',
    org: 'Indiana University School of Medicine',
    logo: 'iu.png',
    logoAlt: 'Indiana University School of Medicine',
    logoClass: 'logo--color',
    paragraphs: [
      'At the Indiana University School of Medicine, I built the machine learning platform for identifying high-risk patients from electronic health records. I aimed to turn research requirements into software that was reproducible, tested, and ready for clinical decision-support use.',
      'I built a clinical feature platform with Python, SQL, PySpark, and dbt, using typed modules, Pytest integration coverage, deterministic transformations, and leakage controls. This reduced regression defects from 11 to 2 per release. On the modeling side, I developed calibrated ensemble models with temporal validation, MLflow experiment tracking, and Optuna-based hyperparameter optimization, improving high-risk case identification by 20% at a clinically constrained precision threshold.',
      'I served the models through FastAPI and Docker with health checks, bounded concurrency, request validation, and graceful failure handling. Across a 90K+ encounter validation workload, this achieved 9,994 successful inference completions per 10,000 requests. I also added model versioning, SHAP-based explanation APIs, Great Expectations data validation, Evidently monitoring, and reproducible deployment workflows for downstream integration.'
    ],
    tags: [
      'Python', 'SQL', 'PySpark', 'dbt', 'MLflow', 'Optuna', 'SHAP', 'FastAPI',
      'Docker', 'Great Expectations'
    ]
  },
  {
    period: 'Jun 2023 - Jul 2024',
    role: 'Software Engineer - ML & Data Systems',
    org: 'Tata Consultancy Services Ltd.',
    logo: 'tcs.png',
    logoAlt: 'Tata Consultancy Services',
    logoClass: 'tl__logo--tcs',
    paragraphs: [
      'At TCS, I worked as an ML systems engineer on data and workflow automation for an energy-sector client. My focus was replacing manual operations with monitored, reliable services and keeping the data platform trustworthy and cost-efficient.',
      'I automated operational workflows with 15+ Airflow-orchestrated Python services, with dependency management, retries, exception routing, and SLA monitoring. This eliminated about 200 staff hours of manual processing per month. I also implemented dbt tests and Great Expectations validation for schema drift, freshness, null handling, and referential integrity, with automated quarantine for failed data. Invalid downstream dataset releases dropped from 23 to 5 per quarter.',
      'On the infrastructure side, I cut idle Snowflake warehouse consumption from 480 to 190 warehouse-hours per month through workload profiling, incremental dbt models, scheduling changes, and right-sizing. I also operationalized containerized workloads with Docker, Kubernetes, AWS CDK, and CloudWatch, which supported code review, automated builds, deployment controls, centralized diagnostics, and production incident investigation.'
    ],
    tags: [
      'Apache Airflow', 'Python', 'Snowflake', 'dbt', 'Great Expectations',
      'Docker', 'Kubernetes', 'AWS CDK', 'Amazon CloudWatch', 'Data Quality'
    ]
  },
  {
    period: 'Jun 2022 - May 2023',
    role: 'Computer Vision Engineer',
    org: 'Ford Motor Company',
    logo: 'ford.png',
    logoAlt: 'Ford Motor Company',
    logoClass: 'tl__logo--ford',
    paragraphs: [
      'At Ford Motor Company, I worked on computer vision for defect detection on assembly parts on the manufacturing line. My focus was making the models better at catching the defects that occur least often.',
      'The training data was heavily imbalanced, with a 90:10 defect-class split across 300K images. I built a CycleGAN and OpenCV synthetic augmentation pipeline in PyTorch and TensorFlow that rebalanced it to 60:40, improving minority-class representation and model robustness.',
      'I then fine-tuned ResNet-50 on the augmented data, with defect evaluation and taxonomy alignment. This cut defect false negatives by 50% and reached 0.91 recall.'
    ],
    tags: [
      'Computer Vision', 'PyTorch', 'TensorFlow', 'OpenCV', 'CycleGAN', 'GANs',
      'ResNet-50', 'Data Augmentation', 'Synthetic Data Generation',
      'Defect Detection'
    ]
  }
];

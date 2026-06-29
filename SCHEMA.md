# Database Schema

## Purpose

This document explains the database structure for the app

## Tables

### Users

Purpose:

This table stores all the unique user information associated with an account. This table pulls existing information that is created via auth to ensure no duplication and uniqueness.

Although the User table requires multiple columns derived from Auth it is important to have a user table present and keep auth as its single responsibility as authentication and the user table for user storage. As the app grows additional information may be captured

Columns:

| Column     | Type                                                  | Required | Purpose                                                                                         |
| ---------- | ----------------------------------------------------- | -------- | ----------------------------------------------------------------------------------------------- |
| user_id    | foreign key from Auth table                           | Yes      | this is to ensure each user has one unique ID that connects their account to their Auth         |
| Email      | Text                                                  | no       | Email is used for account association however, this may be null if user signs in via SSO Google |
| Created_at | TIMESTAMPTZ - from auth when user account was created | yes      | Required to know when user account was created                                                  |

Constraints:

Unique Rules:

- each user_id must be unique which is derived from auth for consistency

Non-Null:

- user_id and created_at are to be non-null

Foreign Keys:

- User_id are foreign keys derived from auth

Relationships:

- This table connects to auth via the user_id. User_id becomes the primary key of this table
- user_id creates relationship with document table

Reasoning:

- This table exists in order to associate document upload and questioning with a user account. Furthermore, this allows for scaling of user accounts and features down the line by having a dedicated user table

### Documents

Purpose:

This table stores all the uploaded documents to the system for LLM and RAG retrieval.

Columns:

| Column          | Type                                       | Required | Purpose                                                                                     |
| --------------- | ------------------------------------------ | -------- | ------------------------------------------------------------------------------------------- |
| user_id         | foreign key from User table                | yes      | to associate file uploads with a user                                                       |
| document_id     | uuid - primary key                         | yes      | give each document a unique id to associate with chunking                                   |
| document_name   | text                                       | yes      | provide identifiable name for each document                                                 |
| document_path   | text                                       | no       | provide the supabase storage path for each document. Doesn't happen immediately             |
| status          | enum - Uploaded, Processing, Ready, Failed | yes      | used to provide status on document upload process as chunking and embedding is asynchronous |
| doc_upload_date | timestamptz                                | yes      | provide upload timestamptz for each document upload                                         |

constraints:

Unique Rules:

- document_id is unique and primary key of the table

Non-Null:

- all columns except document_path are to be non-null

Relationships:

- user_id creates relationship with user table to associate user with document uploaded
- document_id creates relationship with chunking table to associate document with chunks

### chunks

Purpose:

this table stores all the chunks from each document that has been uploaded by the user

Columns:

| Column | Type | Required | Purpose |
| ------ | ---- | -------- | ------- |

| document_id | foreign key from documents table | yes | associate each chunk to the original document |
|chunk_id | uuid - primary key of the table | yes | give each chunk a unique identifier |
| chunk | |text | yes | hold the actual body of text of the chunk which is used to send to the LLM |
| chunk_order | int | yes | needed to maintain order when chunking exists across paragraphs greater in size than chunk size |
| paragraph_number | int | yes | gives the paragraph where the chunk exists |
| embedding | vector(1536) | no | turns chunks into embeddings for similarity association |

Constraints:

Unique rules:

- chunk_id is a unique primary key for the table

Non-null:

- all columns except chunk_embedding are non-null

Relationships:

- document_id as a foreign key creates relationship with the document table

### Questions

Purpose:

This table stores the questions asked by the user to query the uploaded documents and is used to create question embedding which the LLM matches with the chunks embedding.

Columns:

Columns:

| Column | Type | Required | Purpose |
| ------ | ---- | -------- | ------- |

| user_id | foreign key from user table | yes | associate questions/querys with a user |
| question_id | uuid - primary key | yes | creates unique identifier for question
| question | text | yes | store the question the user is asking the LLM |
| document_id | foreign key from documents table | yes | associate the question with the document being asked about |
| question_embedding | vector | no | used for matching chunk to question via the LLM |

Constraints:

Unique rules:

- question_id creates a uniqueness per question

Non-null:

- no columns except question_embedding can be nullable

Relationships:

- relationship exists with users table via foreign key user_id
- relationship exists between the question and the document being queried - this is then used to find the relevant similar chunks which is sent to the LLM

//im not sure if auth is its own table or not

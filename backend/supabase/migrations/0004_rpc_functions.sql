-- Vector similarity search RPC for Pharmacist Agent
create or replace function match_medical_guidelines (
  query_embedding vector(3072),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  content text,
  metadata jsonb,
  similarity float
)
language sql stable
as $$
  select
    medical_guidelines.id,
    medical_guidelines.content,
    medical_guidelines.metadata,
    1 - (medical_guidelines.embedding <=> query_embedding) as similarity
  from medical_guidelines
  where 1 - (medical_guidelines.embedding <=> query_embedding) > match_threshold
  order by medical_guidelines.embedding <=> query_embedding
  limit match_count;
$$;

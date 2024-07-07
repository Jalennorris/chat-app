ALTER TABLE public.participants
ADD CONSTRAINT participants_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user" (user_id) ON DELETE CASCADE;


interface Notice {
  _id: string;
  title: string;
  message: string;
}

interface NoticeCardProps {
  notice: Notice;
}

function NoticeCard({ notice }: NoticeCardProps) {
  return (
    <article className="notice-card">
      <h3>{notice.title}</h3>
      <p>{notice.message}</p>
    </article>
  );
}

export default NoticeCard;
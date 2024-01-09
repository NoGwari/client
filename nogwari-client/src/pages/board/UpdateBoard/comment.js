function Comment() {
    const [comments, setComments] = useState([]);
    const [content, setContent] = useState('');
    const [reply, setReply] = useState('');
    const [hits, setHits] = useState(0);
    const [commentHits, setCommentHits] = useState(0);
    const [commentHitStatus, setCommentHitStatus] = useState(false);
    const [isReplying, setIsReplying] = useState(false);

    const fetchComments = async () => {};

    const ishitComment = async () => {
        const response = await fetch(Http + `/comment/hits/${commentId}`, {
            method: 'POST',
            header: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            },
            credentials: 'include',
        });
        if (response.ok) {
        }
    };
}

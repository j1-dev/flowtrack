const Loading = ({ text }: { text: string }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-2">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground">{text}</p>
      </div>
    </div>
  );
};

export default Loading;

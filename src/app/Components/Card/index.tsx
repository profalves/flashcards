interface CardProps {
  information: any;
}

const Card: React.FC<CardProps> = ({ information }) => {
  console.log({ information });
  return (
    <div className="bg-gray-800 text-white p-4 rounded shadow-md mb-4">
      <p className="text-lg">{information?.result}</p>
    </div>
  );
};

export default Card;

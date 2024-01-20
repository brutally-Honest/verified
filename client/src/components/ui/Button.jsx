import { Spinner } from "../../assets/Svg";

export const Button = ({ text, submitHandler, loading = false, style }) => {
  return (
    <button
      onClick={submitHandler}
      loading={String(loading)}
      disabled={loading}
      className={`${style} disabled:cursor-not-allowed `}
      type="submit"
    >
      {loading ? <Spinner /> : text}
    </button>
  );
};

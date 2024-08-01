export const pipe = <T>(param: { value: T }, val: T) => {
	param.value = val;
};

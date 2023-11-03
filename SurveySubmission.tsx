import {
	SURVEY_SUBMISSIONS_QUERY_KEY,
	TSurveySubmitter,
	getSurveySubmissions,
} from '@/client/admin';
import { ScrollArea } from '@/components/common';
import { DashboardLayout, SurveyDetailLayout, Web3SurveysLayout } from '@/components/layouts';
import {
	AnswersList,
	Divider,
	SubmittersTable,
} from '@/components/pages/web3-surveys/components/view/SurveySubmissions/components';
import { useRouter } from 'next/router';
import { ReactElement, useState } from 'react';
import { useQuery } from 'react-query';

const Web3SurveysSubmissionPage = () => {
	const [selectedUser, setSelectedUser] = useState<TSurveySubmitter>();

	const {
		query: { id },
	} = useRouter();

	const { data: surveyInfo } = useQuery(
		[SURVEY_SUBMISSIONS_QUERY_KEY, id],
		() => getSurveySubmissions(id as string),
		{ enabled: !!id && id !== '[id]' }
	);

	return surveyInfo ? (
		<>
			<h2 className="text-base font-semibold leading-5 text-[#151F4E]">
				Survey Submissions {surveyInfo?.total_survey_submissions}
			</h2>

			<div className="mt-6 flex flex-1 gap-x-6">
				<div className="relative flex-1 overflow-hidden">
					<div className="absolute inset-0 flex">
						<div className="flex-1">
							<SubmittersTable
								setSelectedUser={setSelectedUser}
								surveyId={id as string}
								selectedUser={selectedUser}
								totalItems={surveyInfo?.total_survey_submissions}
							/>
						</div>
					</div>
				</div>

				{(selectedUser?.user_id || selectedUser?.started_at) && (
					<div className="flex flex-1 flex-col rounded-lg bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
						<Divider>
							<h2 className="px-8 py-7 text-base font-semibold leading-5 text-[#151F4E]">
								{selectedUser?.user_firstname} {selectedUser?.user_lastname} Results
							</h2>
						</Divider>
						<div className="relative flex-1 overflow-hidden">
							<div className="absolute inset-0 flex">
								<ScrollArea className="overflow-hidden">
									<AnswersList
										statistics={surveyInfo?.statistic_per_question || []}
										surveyId={id as string}
										selectedUser={selectedUser}
									/>
								</ScrollArea>
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	) : null;
};

export default Web3SurveysSubmissionPage;

Web3SurveysSubmissionPage.getLayout = (page: ReactElement) => {
	return (
		<DashboardLayout>
			<Web3SurveysLayout>
				<SurveyDetailLayout>{page}</SurveyDetailLayout>
			</Web3SurveysLayout>
		</DashboardLayout>
	);
};

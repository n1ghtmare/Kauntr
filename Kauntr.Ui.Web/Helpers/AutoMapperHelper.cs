using System.Collections.Generic;

using AutoMapper;

using Kauntr.Core.Entities;
using Kauntr.Ui.Web.Models;

namespace Kauntr.Ui.Web.Helpers {
    public static class AutoMapperHelper {
        static AutoMapperHelper() {
            Mapper.Initialize(cfg => {
                cfg.CreateMap<CountdownAggregate, CountdownViewModel>()
                    .AfterMap((s, d) => d.CreatedByGravatarUrl = s.CreatedByEmail.ToGravatarUrl());

                cfg.CreateMap<CommentAggregate, CommentViewModel>()
                    .AfterMap((s, d) => d.CreatedByGravatarUrl = s.CreatedByEmail.ToGravatarUrl());
            });
        }

        public static CountdownViewModel ToCountdownViewModel(this CountdownAggregate countdownAggregate) {
            return Mapper.Map<CountdownAggregate, CountdownViewModel>(countdownAggregate);
        }

        public static CommentViewModel ToCommentViewModel(this CommentAggregate commentAggregate) {
            return Mapper.Map<CommentAggregate, CommentViewModel>(commentAggregate);
        }

        public static IEnumerable<CountdownViewModel> ToCountdownViewModels(this IEnumerable<CountdownAggregate> countdownAggregates) {
            return Mapper.Map<IEnumerable<CountdownAggregate>, IEnumerable<CountdownViewModel>>(countdownAggregates);
        }

        public static IEnumerable<CommentViewModel> ToCommentViewModels(this IEnumerable<CommentAggregate> commentAggregates) {
            return Mapper.Map<IEnumerable<CommentAggregate>, IEnumerable<CommentViewModel>>(commentAggregates);
        }
    }
}